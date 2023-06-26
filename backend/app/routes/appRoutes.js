const express = require('express');
const { getRestaurantByIdController, getRestaurantByNameController, getRestaurantByHostnameController } = require('../controllers/appController');

const router = express.Router();

router.get('/restaurantId/:restaurantId', getRestaurantByIdController);
router.get('/restaurantName/:restaurantName', getRestaurantByNameController);
router.post('/hostnameCheck', getRestaurantByHostnameController);

module.exports = router;
