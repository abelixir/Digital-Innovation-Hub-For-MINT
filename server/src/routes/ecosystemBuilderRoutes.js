const express = require('express');
const {
  createBuilder,
  getMyBuilder,
  updateMyBuilder,
  getPublicBuilders,
  getAdminBuilders,
  startReviewBuilder,
  approveBuilder,
  rejectBuilder,
  suspendBuilder,
} = require('../controllers/ecosystemBuilderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/public', getPublicBuilders);

router.use(protect);

router.post('/', restrictTo('ecosystem_builder', 'founder', 'admin'), createBuilder);
router.get('/my', restrictTo('ecosystem_builder', 'founder', 'admin'), getMyBuilder);
router.put('/my', restrictTo('ecosystem_builder', 'founder', 'admin'), updateMyBuilder);

router.get('/admin', restrictTo('admin', 'reviewer', 'moderator'), getAdminBuilders);

// Same as startups: reviewer + admin can start review
router.patch(
  '/:id/start-review',
  restrictTo('admin', 'reviewer'),
  startReviewBuilder
);

// Admin only: final decisions
router.patch('/:id/approve', restrictTo('admin'), approveBuilder);
router.patch('/:id/reject', restrictTo('admin'), rejectBuilder);
router.patch('/:id/suspend', restrictTo('admin'), suspendBuilder);

module.exports = router;