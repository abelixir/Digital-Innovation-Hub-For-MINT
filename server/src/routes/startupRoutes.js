const express = require('express');
const {
  createStartup,
  getMyStartup,
  updateMyStartup,
  getVerifiedStartups,
  getStartup,
  getPendingStartups,
  approveStartup,
  rejectStartup,
  getAdminStats,
  getPublicStats,
  getAdminStartups,
  deleteStartup,
  suspendStartup,
  revokeStartup,
  getStartupCase,
  requestRenewal,
  approveRenewal,
} = require('../controllers/startupController');
const { migrateStartupDesignationData } = require('../controllers/migrationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getVerifiedStartups);
router.get('/public-stats', getPublicStats);

// Protected
router.use(protect);

router.post('/', restrictTo('founder'), createStartup);
router.get('/my', restrictTo('founder'), getMyStartup);
router.put('/my', restrictTo('founder'), updateMyStartup);
router.post('/my/renew', restrictTo('founder'), requestRenewal);

router.get('/pending', restrictTo('admin'), getPendingStartups);
router.get('/stats', restrictTo('admin'), getAdminStats);
router.get('/admin', restrictTo('admin'), getAdminStartups);
router.post('/admin/migrate-designation', restrictTo('admin'), migrateStartupDesignationData);

router.get('/:id/case', restrictTo('admin'), getStartupCase);
router.patch('/:id/approve', restrictTo('admin'), approveStartup);
router.patch('/:id/reject', restrictTo('admin'), rejectStartup);
router.patch('/:id/suspend', restrictTo('admin'), suspendStartup);
router.patch('/:id/revoke', restrictTo('admin'), revokeStartup);
router.patch('/:id/renew/approve', restrictTo('admin'), approveRenewal);
router.delete('/:id', restrictTo('admin'), deleteStartup);

router.get('/:id', getStartup);

module.exports = router;