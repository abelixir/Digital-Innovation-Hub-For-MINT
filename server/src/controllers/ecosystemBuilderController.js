const EcosystemBuilder = require('../models/EcosystemBuilder');
const CaseDecision = require('../models/CaseDecision');
const sendEmail = require('../utils/sendEmail');
const { addWorkingDays } = require('../services/eligibilityService');

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function makeBuilderCertificateNumber(id) {
  const year = new Date().getFullYear();
  const short = String(id).slice(-6).toUpperCase();
  return `MINT-EB-${year}-${short}`;
}

exports.createBuilder = async (req, res) => {
  try {
    const existing = await EcosystemBuilder.findOne({ ownerUser: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an ecosystem builder application',
      });
    }

    const now = new Date();
    const builder = await EcosystemBuilder.create({
      ...req.body,
      ownerUser: req.user._id,
      status: 'pending',
      submittedAt: now,
      reviewDueAt: addWorkingDays(now, 30),
    });

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'submit',
      reason: 'Ecosystem builder application submitted',
      notes: '',
      actor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Ecosystem builder application submitted',
      data: builder,
    });
  } catch (error) {
    console.error('Create builder error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.getMyBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findOne({ ownerUser: req.user._id });
    if (!builder) {
      return res.status(404).json({
        success: false,
        message: 'No ecosystem builder application found',
      });
    }
    res.status(200).json({ success: true, data: builder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.updateMyBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findOne({ ownerUser: req.user._id });
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    Object.assign(builder, req.body);
    await builder.save();

    res.status(200).json({
      success: true,
      message: 'Application updated',
      data: builder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.getPublicBuilders = async (req, res) => {
  try {
    const builders = await EcosystemBuilder.find({ status: 'designated' })
      .sort({ designatedAt: -1 })
      .select('-rejectionReason -suspensionReason -revocationReason -adminNotes');

    res.status(200).json({
      success: true,
      count: builders.length,
      data: builders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.getAdminBuilders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      if (status === 'pending' || status === 'queue') {
        filter.status = { $in: ['pending', 'submitted', 'under_review'] };
      } else {
        filter.status = status;
      }
    }

    const builders = await EcosystemBuilder.find(filter)
      .populate('ownerUser', 'fullName email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: builders.length,
      data: builders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Reviewer / admin: mark under review (notes required, same as startups)
exports.startReviewBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findById(req.params.id);
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    if (!['pending', 'submitted', 'under_review'].includes(builder.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only pending applications can be marked under review',
      });
    }

    const notes = (req.body?.notes || '').trim();
    if (!notes || notes.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          'Review notes are required (at least 10 characters). Admin will read these before final decision.',
      });
    }

    builder.status = 'under_review';
    builder.reviewedBy = req.user._id;
    builder.adminNotes = notes;
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'start_review',
      reason: 'Reviewer marked builder case under review',
      notes,
      actor: req.user._id,
      meta: { reviewerRole: req.user.role },
    });

    res.status(200).json({
      success: true,
      message: 'Marked under review. Notes saved for admin audit.',
      data: builder,
    });
  } catch (error) {
    console.error('Start review builder error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Admin only: designate
exports.approveBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findById(req.params.id).populate(
      'ownerUser',
      'fullName email'
    );
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const now = new Date();
    const expiresAt = addYears(now, 5);
    const certificateNumber = makeBuilderCertificateNumber(builder._id);

    builder.status = 'designated';
    builder.designatedAt = now;
    builder.designationExpiresAt = expiresAt;
    builder.certificateNumber = certificateNumber;
    builder.rejectionReason = '';
    builder.suspensionReason = '';
    builder.reviewedBy = req.user._id;
    builder.adminNotes = req.body?.notes || builder.adminNotes || '';
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'approve',
      reason: 'Ecosystem builder designated by MinT admin',
      notes: req.body?.notes || '',
      actor: req.user._id,
      meta: { certificateNumber, designationExpiresAt: expiresAt },
    });

    if (builder.ownerUser?.email) {
      await sendEmail({
        to: builder.ownerUser.email,
        subject: `Ecosystem Builder Designation – ${builder.organizationName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#0d9488;">Ecosystem Builder Designated</h2>
            <p>Hello ${builder.ownerUser.fullName || 'Applicant'},</p>
            <p><strong>${builder.organizationName}</strong> has been designated as a Startup Ecosystem Builder.</p>
            <p><strong>Certificate:</strong> ${certificateNumber}</p>
            <p><strong>Valid until:</strong> ${expiresAt.toDateString()}</p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ecosystem builder designated',
      data: builder,
    });
  } catch (error) {
    console.error('Approve builder error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Admin only: reject
exports.rejectBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findById(req.params.id).populate(
      'ownerUser',
      'fullName email'
    );
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const reason = (req.body?.reason || '').trim() || 'Did not meet ecosystem builder criteria';
    const notes = req.body?.notes || '';

    builder.status = 'rejected';
    builder.rejectionReason = reason;
    builder.suspensionReason = '';
    builder.reviewedBy = req.user._id;
    builder.adminNotes = notes;
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'reject',
      reason,
      notes,
      actor: req.user._id,
    });

    if (builder.ownerUser?.email) {
      await sendEmail({
        to: builder.ownerUser.email,
        subject: `Ecosystem Builder Update – ${builder.organizationName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#64748b;">Application not approved</h2>
            <p>Hello ${builder.ownerUser.fullName || 'Applicant'},</p>
            <p><strong>${builder.organizationName}</strong> was not designated at this time.</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: builder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Admin only: suspend
exports.suspendBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findById(req.params.id).populate(
      'ownerUser',
      'fullName email'
    );
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const reason = (req.body?.reason || '').trim() || 'Suspended by MinT admin';
    const notes = req.body?.notes || '';

    builder.status = 'suspended';
    builder.suspensionReason = reason;
    builder.reviewedBy = req.user._id;
    builder.adminNotes = notes;
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'suspend',
      reason,
      notes,
      actor: req.user._id,
    });

    if (builder.ownerUser?.email) {
      await sendEmail({
        to: builder.ownerUser.email,
        subject: `Ecosystem Builder Suspended – ${builder.organizationName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#b45309;">Designation suspended</h2>
            <p>Hello ${builder.ownerUser.fullName || 'Applicant'},</p>
            <p>The designation for <strong>${builder.organizationName}</strong> has been suspended.</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Builder suspended',
      data: builder,
    });
  } catch (error) {
    console.error('Suspend builder error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};