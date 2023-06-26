const { getRestaurantById, getRestaurantByName, getRestaurantByHostname } = require('../datamodels');

const getRestaurantByIdController = async (req, res) => {
	const { params: { restaurantId } } = req;
	console.log(req.params);

	try {
		const result = await getRestaurantById(restaurantId);
		res.send(result);
	} catch (error) {
		res.sendStatus(404);
	}
};

const getRestaurantByNameController = async (req, res) => {
	const { params: { restaurantName } } = req;

	try {
		const result = await getRestaurantByName(restaurantName);
		res.send(result);
	} catch (error) {
		res.sendStatus(404);
	}
};


const getRestaurantByHostnameController = async (req, res) => {
	const { body: { hostname } } = req;
	if (!hostname) {
		res.sendStatus(404);
	} else {
		try {
			const result = await getRestaurantByHostname(hostname);
			if (!result) res.sendStatus(404);
			res.send(result);
		} catch (error) {
			res.sendStatus(404);
		}
	}
};

module.exports = {
	getRestaurantByIdController,
	getRestaurantByNameController,
	getRestaurantByHostnameController,
};
