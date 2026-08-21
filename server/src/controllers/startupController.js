const Startup = require('../models/Startup');
const CaseDecision = require('../models/CaseDecision');
const DesignationCertificate = require('../models/DesignationCertificate');
const sendEmail = require('../utils/sendEmail');

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

    const now = new Date();
    const reviewDueAt = new Date(now);
    reviewDueAt.setDate(reviewDueAt.getDate() + 30);

    const startup = await Startup.create({
      ...req.body,
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
      notes: '',
      actor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Startup submitted successfully. Waiting for MinT designation review.',
      data: startup,
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

    res.status(200).json({ success: true, data: startup });
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

    Object.assign(startup, req.body);
    await startup.save();

    res.status(200).json({
      success: true,
      message: 'Startup updated successfully',
      data: startup,
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

// ====================== ADMIN: APPROVE / DESIGNATE STARTUP ======================
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
      meta: {
        certificateNumber,
        designationExpiresAt: expiresAt,
      },
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
            <p>Your startup is now visible in the public directory and open to investor interest.</p>
            <p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/directory/${startupId}"
                 style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                View Public Profile
              </a>
            </p>
            <p style="color: #666; font-size: 13px; margin-top: 30px;">
              Digital Innovation Hub · Ministry of Innovation and Technology
            </p>
          </div>
        `,
      });
    } else {
      console.log('Approve email skipped: founder email missing');
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

// ====================== ADMIN: REJECT STARTUP ======================
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
            <p>You can update your profile and resubmit for review.</p>
            <p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/founder"
                 style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Go to Dashboard
              </a>
            </p>
            <p style="color: #666; font-size: 13px; margin-top: 30px;">
              Digital Innovation Hub · Ministry of Innovation and Technology
            </p>
          </div>
        `,
      });
    } else {
      console.log('Reject email skipped: founder email missing');
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

// ====================== ADMIN: DELETE STARTUP ======================
exports.deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    const reason = req.body?.reason || 'Deleted by admin';
    const notes = req.body?.notes || '';

    // Write audit first (safe even if body is empty)
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

// ====================== ADMIN: DASHBOARD STATS ======================
exports.getAdminStats = async (req, res) => {
  try {
    const [total, verified, pending, rejected] = await Promise.all([
      Startup.countDocuments(),
      Startup.countDocuments({ status: { $in: PUBLIC_STATUSES } }),
      Startup.countDocuments({
        status: { $in: ['pending', 'submitted', 'under_review'] },
      }),
      Startup.countDocuments({ status: 'rejected' }),
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
        totalInvestors: investors,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ====================== ADMIN: LIST STARTUPS BY STATUS ======================
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

// ====================== PUBLIC: HOME PAGE STATS ======================
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