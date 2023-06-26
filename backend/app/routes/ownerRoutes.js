const express = require('express');
const { updateOrderController, getActiveOrdersController, getTableByRestaurantIdController, getTableByIdController, closeTableController, callWaiterController } = require('../controllers/ownerController');

const router = express.Router();

router.post('/orders/update/:orderId', updateOrderController);
router.get('/orders/active/:restaurantId', getActiveOrdersController);

router.get('/tables/:restaurantId', getTableByRestaurantIdController);

router.get('/table/:tableId', getTableByIdController);
router.get('/table/close/:tableId', closeTableController);

router.get('/actions/clearCallWaiter/:tabId', callWaiterController);
module.exports = router;
