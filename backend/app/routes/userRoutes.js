const express = require("express");
const { getMenu, getRandomTable, getTable, getTab, newOrder, getOrder } = require("../controllers/userController");

const router = express.Router();

router.get("/menus/:id", getMenu);
router.get("/getRandomTable/:restaurantId", getRandomTable);
router.get("/tables/:tableId", getTable);
router.get("/tabs/:tabId", getTab);
router.post("/orders/new/:tabId", newOrder);
router.get("/orders/:orderId", getOrder);

module.exports = router;
