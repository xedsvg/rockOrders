const express = require("express");
const { getSettings } = require("../controllers/appController");

const router = express.Router();

router.get("/settings", getSettings);

module.exports = router;
