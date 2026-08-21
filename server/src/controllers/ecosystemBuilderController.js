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

// POST /api/ecosystem-builders
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

// GET /api/ecosystem-builders/my
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

// PUT /api/ecosystem-builders/my
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

// GET /api/ecosystem-builders/public
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

// GET /api/ecosystem-builders/admin
exports.getAdminBuilders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

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

// PATCH /api/ecosystem-builders/:id/approve
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
    builder.reviewedBy = req.user._id;
    builder.adminNotes = req.body?.notes || '';
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'approve',
      reason: 'Ecosystem builder designated',
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

// PATCH /api/ecosystem-builders/:id/reject
exports.rejectBuilder = async (req, res) => {
  try {
    const builder = await EcosystemBuilder.findById(req.params.id).populate(
      'ownerUser',
      'fullName email'
    );
    if (!builder) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const reason = req.body?.reason || 'Did not meet ecosystem builder criteria';
    builder.status = 'rejected';
    builder.rejectionReason = reason;
    builder.reviewedBy = req.user._id;
    builder.adminNotes = req.body?.notes || '';
    await builder.save();

    await CaseDecision.create({
      entityType: 'ecosystem_builder',
      entityId: builder._id,
      action: 'reject',
      reason,
      notes: req.body?.notes || '',
      actor: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: builder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};