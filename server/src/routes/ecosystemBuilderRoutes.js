const express = require('express');
const {
  createBuilder,
  getMyBuilder,
  updateMyBuilder,
  getPublicBuilders,
  getAdminBuilders,
  approveBuilder,
  rejectBuilder,
} = require('../controllers/ecosystemBuilderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/public', getPublicBuilders);

router.use(protect);

router.post('/', restrictTo('ecosystem_builder', 'founder', 'admin'), createBuilder);
router.get('/my', restrictTo('ecosystem_builder', 'founder', 'admin'), getMyBuilder);
router.put('/my', restrictTo('ecosystem_builder', 'founder', 'admin'), updateMyBuilder);

router.get('/admin', restrictTo('admin'), getAdminBuilders);
router.patch('/:id/approve', restrictTo('admin'), approveBuilder);
router.patch('/:id/reject', restrictTo('admin'), rejectBuilder);

module.exports = router;