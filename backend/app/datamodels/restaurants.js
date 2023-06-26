const { Restaurants } = require('../db/models');

const getRestaurantById = async (restaurantId) => {
	const { _id, name: restaurantName, ownerName, maxInstances } = await Restaurants.findOne({ _id: restaurantId});
    
	return {
		restaurantId: _id,
		restaurantName,
		ownerName,
		maxInstances
	};
};

const getRestaurantByName = async (restaurantNameFromUrl) => {
	const { _id, name: restaurantName, ownerName, maxInstances } = await Restaurants.findOne({ name: restaurantNameFromUrl});
    
	return {
		restaurantId: _id,
		restaurantName,
		ownerName,
		maxInstances
	};
};
  
const getRestaurantByHostname = async (hostname) => {
	const { _id, name: restaurantName, ownerName, maxInstances } = await Restaurants.findOne({ externalHostnames: hostname });
   
	return {
		restaurantId: _id,
		restaurantName,
		ownerName,
		maxInstances
	};
};


module.exports = {
	getRestaurantById,
	getRestaurantByName,
	getRestaurantByHostname,
};
  