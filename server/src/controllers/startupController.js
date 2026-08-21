const Startup = require('../models/Startup');
const CaseDecision = require('../models/CaseDecision');
const DesignationCertificate = require('../models/DesignationCertificate');
const sendEmail = require('../utils/sendEmail');
const {
  evaluateStartupEligibility,
  addWorkingDays,
} = require('../services/eligibilityService');

const PUBLIC_STATUSES = ['verified', 'designated'];

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function makeCertificateNumber(startupId) {
  const year = new Date().getFullYear();
  const short = String(startupId).slice(-6).toUpperCase();
  return `MINT-DES-${year}-${short}`;
}

// ====================== CREATE STARTUP (Founder) ======================
exports.createStartup = async (req, res) => {
  try {
    const existing = await Startup.findOne({ founder: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a startup profile',
      });
    }

    // strictEligibility comes from request body (optional)
    const strict = req.body?.strictEligibility === true;
    const eligibility = evaluateStartupEligibility(req.body, { strict });

    if (!eligibility.ok) {
      return res.status(400).json({
        success: false,
        message: 'Eligibility checks failed',
        errors: eligibility.errors,
        warnings: eligibility.warnings,
        checks: eligibility.checks,
      });
    }

    const now = new Date();
    const reviewDueAt = addWorkingDays(now, 30);

    // Do not store helper flag in DB
    const payload = { ...req.body };
    delete payload.strictEligibility;

    const startup = await Startup.create({
      ...payload,
      founder: req.user._id,
      status: 'pending',
      submittedAt: now,
      reviewDueAt,
    });

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'submit',
      reason: 'Startup application submitted',
      notes: eligibility.warnings.join('; '),
      actor: req.user._id,
      meta: { eligibility, strict },
    });

    res.status(201).json({
      success: true,
      message: 'Startup submitted successfully. Waiting for MinT designation review.',
      data: startup,
      eligibility,
    });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== GET MY STARTUP (Founder) ======================
exports.getMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder: req.user._id });

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: 'No startup found. Please create one.',
      });
    }

    const eligibility = evaluateStartupEligibility(startup, { strict: false });

    res.status(200).json({
      success: true,
      data: startup,
      eligibility,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== UPDATE MY STARTUP (Founder) ======================
exports.updateMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder: req.user._id });

    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const payload = { ...req.body };
    delete payload.strictEligibility;

    Object.assign(startup, payload);

    // strictEligibility comes from request body (optional)
    const strict = req.body?.strictEligibility === true;
    const eligibility = evaluateStartupEligibility(startup, { strict });

    if (!eligibility.ok) {
      return res.status(400).json({
        success: false,
        message: 'Eligibility checks failed',
        errors: eligibility.errors,
        warnings: eligibility.warnings,
        checks: eligibility.checks,
      });
    }

    await startup.save();

    res.status(200).json({
      success: true,
      message: 'Startup updated successfully',
      data: startup,
      eligibility,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== GET ALL VERIFIED/DESIGNATED STARTUPS ======================
exports.getVerifiedStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ status: { $in: PUBLIC_STATUSES } })
      .sort({ designatedAt: -1, verifiedAt: -1 })
      .select('-rejectionReason -suspensionReason -revocationReason -adminNotes');

    res.status(200).json({
      success: true,
      count: startups.length,
      data: startups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== GET SINGLE STARTUP ======================
exports.getStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const isPublic = PUBLIC_STATUSES.includes(startup.status);
    const isOwner =
      req.user && startup.founder.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isPublic && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This startup is not public yet',
      });
    }

    res.status(200).json({ success: true, data: startup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== ADMIN: CASE DETAIL ======================
exports.getStartupCase = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate(
      'founder',
      'fullName email role'
    );

    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const [certificate, auditTrail] = await Promise.all([
      DesignationCertificate.findOne({ startup: startup._id }).sort({ issuedAt: -1 }),
      CaseDecision.find({ entityType: 'startup', entityId: startup._id })
        .populate('actor', 'fullName email role')
        .sort({ createdAt: -1 }),
    ]);

    const eligibility = evaluateStartupEligibility(startup, { strict: false });
    const now = new Date();
    const isOverdue =
      startup.reviewDueAt &&
      ['pending', 'submitted', 'under_review'].includes(startup.status) &&
      new Date(startup.reviewDueAt) < now;

    res.status(200).json({
      success: true,
      data: {
        startup,
        certificate,
        auditTrail,
        eligibility,
        meta: {
          isOverdue: Boolean(isOverdue),
          reviewDueAt: startup.reviewDueAt,
        },
      },
    });
  } catch (error) {
    console.error('Get startup case error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: GET PENDING STARTUPS ======================
exports.getPendingStartups = async (req, res) => {
  try {
    const startups = await Startup.find({
      status: { $in: ['pending', 'submitted', 'under_review'] },
    })
      .populate('founder', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: startups.length,
      data: startups,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== ADMIN: APPROVE / DESIGNATE ======================
exports.approveStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate(
      'founder',
      'fullName email'
    );

    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const founderEmail = startup.founder?.email;
    const founderName = startup.founder?.fullName || 'Founder';
    const companyName = startup.companyName;
    const startupId = startup._id;
    const notes = req.body?.notes || '';

    const now = new Date();
    const expiresAt = addYears(now, 2);
    const maxUntil = addYears(now, 8);
    const certificateNumber = makeCertificateNumber(startupId);

    startup.status = 'verified';
    startup.verifiedAt = now;
    startup.designatedAt = now;
    startup.designationExpiresAt = expiresAt;
    startup.designationMaxUntil = maxUntil;
    startup.certificateNumber = certificateNumber;
    startup.rejectionReason = '';
    startup.suspensionReason = '';
    startup.revocationReason = '';
    startup.reviewedBy = req.user._id;
    startup.adminNotes = notes;
    await startup.save();

    await DesignationCertificate.findOneAndUpdate(
      { startup: startupId },
      {
        startup: startupId,
        certificateNumber,
        startupName: companyName,
        founderNames: founderName,
        growthStage: startup.fundingStage || '',
        sector: startup.sector || '',
        issuedAt: now,
        expiresAt,
        issuedBy: req.user._id,
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startupId,
      action: 'approve',
      reason: 'Startup designated/verified by MinT admin',
      notes,
      actor: req.user._id,
      meta: { certificateNumber, designationExpiresAt: expiresAt },
    });

    if (founderEmail) {
      await sendEmail({
        to: founderEmail,
        subject: `MinT Designation Approved – ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Your Startup is Designated by MinT</h2>
            <p>Hello ${founderName},</p>
            <p>
              Congratulations! <strong>${companyName}</strong> has been reviewed and
              <strong>designated</strong> by the Ministry of Innovation and Technology.
            </p>
            <p><strong>Certificate No:</strong> ${certificateNumber}</p>
            <p><strong>Valid until:</strong> ${expiresAt.toDateString()}</p>
            <p style="color: #666; font-size: 13px; margin-top: 30px;">
              Digital Innovation Hub · Ministry of Innovation and Technology
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Startup approved and designated',
      data: startup,
    });
  } catch (error) {
    console.error('Approve startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: REJECT ======================
exports.rejectStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate(
      'founder',
      'fullName email'
    );

    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const founderEmail = startup.founder?.email;
    const founderName = startup.founder?.fullName || 'Founder';
    const companyName = startup.companyName;
    const reason = req.body?.reason || 'Did not meet designation criteria';
    const notes = req.body?.notes || '';

    startup.status = 'rejected';
    startup.rejectionReason = reason;
    startup.reviewedBy = req.user._id;
    startup.adminNotes = notes;
    await startup.save();

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'reject',
      reason,
      notes,
      actor: req.user._id,
    });

    if (founderEmail) {
      await sendEmail({
        to: founderEmail,
        subject: `Designation Update – ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #64748b;">Startup Designation Update</h2>
            <p>Hello ${founderName},</p>
            <p>
              After review, <strong>${companyName}</strong> was not approved for
              MinT designation at this time.
            </p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p style="color: #666; font-size: 13px; margin-top: 30px;">
              Digital Innovation Hub · Ministry of Innovation and Technology
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Startup rejected',
      data: startup,
    });
  } catch (error) {
    console.error('Reject startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: SUSPEND ======================
exports.suspendStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const reason = req.body?.reason || 'Suspended by MinT admin';
    const notes = req.body?.notes || '';

    startup.status = 'suspended';
    startup.suspensionReason = reason;
    startup.reviewedBy = req.user._id;
    startup.adminNotes = notes;
    await startup.save();

    await DesignationCertificate.updateMany(
      { startup: startup._id, status: 'active' },
      { status: 'suspended' }
    );

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'suspend',
      reason,
      notes,
      actor: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Startup suspended',
      data: startup,
    });
  } catch (error) {
    console.error('Suspend startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: REVOKE ======================
exports.revokeStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const reason = req.body?.reason || 'Designation revoked by MinT admin';
    const notes = req.body?.notes || '';

    startup.status = 'revoked';
    startup.revocationReason = reason;
    startup.reviewedBy = req.user._id;
    startup.adminNotes = notes;
    await startup.save();

    await DesignationCertificate.updateMany(
      { startup: startup._id },
      { status: 'revoked' }
    );

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'revoke',
      reason,
      notes,
      actor: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Startup designation revoked',
      data: startup,
    });
  } catch (error) {
    console.error('Revoke startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== FOUNDER: REQUEST RENEWAL ======================
exports.requestRenewal = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder: req.user._id });
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (!['verified', 'designated', 'renewal_due'].includes(startup.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only designated startups can request renewal',
      });
    }

    if (!startup.designationExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No designation expiry date found',
      });
    }

    const now = new Date();
    const expiresAt = new Date(startup.designationExpiresAt);
    const daysLeft = (expiresAt - now) / (1000 * 60 * 60 * 24);

    if (daysLeft > 30 && startup.status !== 'renewal_due') {
      return res.status(400).json({
        success: false,
        message: 'Renewal can be requested within 30 days of expiry',
      });
    }

    if (startup.designationMaxUntil && now > new Date(startup.designationMaxUntil)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum designation period (8 years) has been reached',
      });
    }

    startup.status = 'renewal_due';
    await startup.save();

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'renew',
      reason: 'Founder requested designation renewal',
      notes: req.body?.notes || '',
      actor: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Renewal request submitted',
      data: startup,
    });
  } catch (error) {
    console.error('Request renewal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: APPROVE RENEWAL ======================
exports.approveRenewal = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate(
      'founder',
      'fullName email'
    );
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (startup.status !== 'renewal_due') {
      return res.status(400).json({
        success: false,
        message: 'Startup is not in renewal_due status',
      });
    }

    const now = new Date();
    if (startup.designationMaxUntil && now > new Date(startup.designationMaxUntil)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum designation period reached',
      });
    }

    const newExpiry = addYears(now, 2);
    if (
      startup.designationMaxUntil &&
      newExpiry > new Date(startup.designationMaxUntil)
    ) {
      startup.designationExpiresAt = startup.designationMaxUntil;
    } else {
      startup.designationExpiresAt = newExpiry;
    }

    startup.status = 'verified';
    startup.designatedAt = now;
    startup.reviewedBy = req.user._id;
    startup.adminNotes = req.body?.notes || '';
    await startup.save();

    await DesignationCertificate.findOneAndUpdate(
      { startup: startup._id },
      {
        expiresAt: startup.designationExpiresAt,
        status: 'active',
        issuedAt: now,
        issuedBy: req.user._id,
      }
    );

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'renew',
      reason: 'Admin approved designation renewal',
      notes: req.body?.notes || '',
      actor: req.user._id,
      meta: { designationExpiresAt: startup.designationExpiresAt },
    });

    res.status(200).json({
      success: true,
      message: 'Renewal approved',
      data: startup,
    });
  } catch (error) {
    console.error('Approve renewal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: DELETE ======================
exports.deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const reason = req.body?.reason || 'Deleted by admin';
    const notes = req.body?.notes || '';

    await CaseDecision.create({
      entityType: 'startup',
      entityId: startup._id,
      action: 'delete',
      reason,
      notes,
      actor: req.user._id,
    });

    await DesignationCertificate.deleteMany({ startup: startup._id });
    await startup.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Startup deleted successfully',
    });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ====================== ADMIN: STATS ======================
exports.getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const [total, verified, pending, rejected, suspended, overdue] = await Promise.all([
      Startup.countDocuments(),
      Startup.countDocuments({ status: { $in: PUBLIC_STATUSES } }),
      Startup.countDocuments({
        status: { $in: ['pending', 'submitted', 'under_review'] },
      }),
      Startup.countDocuments({ status: 'rejected' }),
      Startup.countDocuments({ status: 'suspended' }),
      Startup.countDocuments({
        status: { $in: ['pending', 'submitted', 'under_review'] },
        reviewDueAt: { $lt: now },
      }),
    ]);

    const User = require('../models/User');
    const investors = await User.countDocuments({ role: 'investor' });

    res.status(200).json({
      success: true,
      data: {
        totalStartups: total,
        verified,
        pending,
        rejected,
        suspended,
        overdue,
        totalInvestors: investors,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== ADMIN: LIST ======================
exports.getAdminStartups = async (req, res) => {
  try {
    const { status, search, sector } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (sector) filter.sector = sector;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { oneLineDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const startups = await Startup.find(filter)
      .populate('founder', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: startups.length,
      data: startups,
    });
  } catch (error) {
    console.error('Admin startups error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== PUBLIC STATS ======================
exports.getPublicStats = async (req, res) => {
  try {
    const User = require('../models/User');

    const [verified, totalInvestors, totalStartups] = await Promise.all([
      Startup.countDocuments({ status: { $in: PUBLIC_STATUSES } }),
      User.countDocuments({ role: 'investor' }),
      Startup.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        verifiedStartups: verified,
        totalInvestors,
        totalStartups,
        sectorsCovered: 7,
      },
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};