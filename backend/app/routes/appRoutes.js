const express = require("express");
const { getRestaurantById, getRestaurantByName, hostnameCheck } = require("../controllers/appController");

const router = express.Router();

router.get("/restaurantName/:restaurantName", getRestaurantByName);
router.get("/restaurantId/:restaurantId", getRestaurantById);
router.post("/hostnameCheck", hostnameCheck);

module.exports = router;
