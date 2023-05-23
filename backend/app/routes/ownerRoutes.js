const express = require("express");
const { updateOrder, getActiveOrders, clearCallWaiter } = require("../controllers/ownerController");

const router = express.Router();

router.post("/orders/update/:orderId", updateOrder);
router.get("/orders/active/:restaurantId", getActiveOrders);

router.get("/actions/clearCallWaiter/:tabId", clearCallWaiter);
module.exports = router;
