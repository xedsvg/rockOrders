const express = require("express");
const { updateOrder, getActiveOrders } = require("../controllers/ownerController");

const router = express.Router();

router.post("/orders/update/:orderId", updateOrder);
router.get("/orders/active/:restaurantId", getActiveOrders);

module.exports = router;
