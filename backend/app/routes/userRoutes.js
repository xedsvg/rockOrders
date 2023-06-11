const express = require('express');
const { getMenuController, getRandomTableController, getTableController, getTableStatusController, getTabController, newOrderController, getOrderController, callWaiterController, payCardController, payCashController } = require('../controllers/userController');
const PROD = process.env.NODE_ENV === 'production';

const router = express.Router();

router.get('/menus/:restaurantId', getMenuController);

if (!PROD) {
	router.get('/getRandomTable/:restaurantId', getRandomTableController);
}

router.get('/tables/:tableId', getTableController);
router.get('/tableStatus/:tableId', getTableStatusController);

router.get('/tabs/:tabId', getTabController);

router.post('/orders/new/:tabId', newOrderController);
router.get('/orders/:orderId', getOrderController);

router.get('/actions/callWaiter/:tabId', callWaiterController);
router.get('/actions/payCash/:tabId', payCardController);
router.get('/actions/payCard/:tabId', payCashController);

module.exports = router;
