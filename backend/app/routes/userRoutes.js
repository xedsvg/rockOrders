const express = require("express");
const { getMenu, getRandomTable, getTable, getTab, newOrder, getOrder, callWaiter, payCard, payCash } = require("../controllers/userController");

const router = express.Router();

router.get("/menus/:id", getMenu);

router.get("/getRandomTable/:restaurantId", getRandomTable);

router.get("/tables/:tableId", getTable);

router.get("/tabs/:tabId", getTab);

router.post("/orders/new/:tabId", newOrder);
router.get("/orders/:orderId", getOrder);

router.get("/actions/callWaiter/:tabId", callWaiter);
router.get("/actions/payCash/:tabId", payCash);
router.get("/actions/payCard/:tabId", payCard);

module.exports = router;
