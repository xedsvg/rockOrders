const express = require("express");
const { updateOrder, getActiveOrders, getTables, getTable, closeTable, clearCallWaiter } = require("../controllers/ownerController");

const router = express.Router();

router.post("/orders/update/:orderId", updateOrder);
router.get("/orders/active/:restaurantId", getActiveOrders);

router.get("/tables/:restaurantId", getTables);

router.get("/table/:tableId", getTable);
router.get("/table/close/:tableId", closeTable);

router.get("/actions/clearCallWaiter/:tabId", clearCallWaiter);
module.exports = router;
