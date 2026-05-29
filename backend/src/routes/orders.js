const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateStatus,
  archiveOldOrders,
  getDailyOrders,
  getRevenueByStore,
  getTopItems
} = require('../controllers/ordersController');
const { validateOrder, validateStatus } = require('../middleware/validate');

router.post('/', validateOrder, createOrder);
router.get('/', getOrders);
router.patch('/:id/status', validateStatus, updateStatus);
router.post('/archive-old-orders', archiveOldOrders);
router.get('/analytics/daily', getDailyOrders);
router.get('/analytics/revenue', getRevenueByStore);
router.get('/analytics/top-items', getTopItems);

module.exports = router;