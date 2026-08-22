const express = require('express');
const {
  createStartup,
  getMyStartup,
  updateMyStartup,
  getVerifiedStartups,
  getStartup,
  getStartupCase,
  getPendingStartups,
  approveStartup,
  rejectStartup,
  suspendStartup,
  revokeStartup,
  requestRenewal,
  approveRenewal,
  getAdminStats,
  getPublicStats,
  getAdminStartups,
  deleteStartup,
  startReview,
} = require('../controllers/startupController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getVerifiedStartups);
router.get('/public-stats', getPublicStats);

router.use(protect);

// Founder
router.post('/', restrictTo('founder'), createStartup);
router.get('/my', restrictTo('founder'), getMyStartup);
router.put('/my', restrictTo('founder'), updateMyStartup);
router.post('/my/renew', restrictTo('founder'), requestRenewal);

// Admin + Reviewer: queue & stats & case view
router.get('/pending', restrictTo('admin', 'reviewer'), getPendingStartups);
router.get('/stats', restrictTo('admin', 'reviewer'), getAdminStats);
router.get('/admin', restrictTo('admin', 'reviewer'), getAdminStartups);
router.get('/:id/case', restrictTo('admin', 'reviewer'), getStartupCase);

// Reviewer + Admin: mark under review (committee work)
router.patch('/:id/start-review', restrictTo('admin', 'reviewer'), startReview);

// Admin only: final Ministry decisions
router.patch('/:id/approve', restrictTo('admin'), approveStartup);
router.patch('/:id/reject', restrictTo('admin'), rejectStartup);
router.patch('/:id/suspend', restrictTo('admin'), suspendStartup);
router.patch('/:id/revoke', restrictTo('admin'), revokeStartup);
router.patch('/:id/approve-renewal', restrictTo('admin'), approveRenewal);
router.delete('/:id', restrictTo('admin'), deleteStartup);

router.get('/:id', getStartup);

module.exports = router;