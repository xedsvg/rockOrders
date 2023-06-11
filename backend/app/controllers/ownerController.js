const { closeTableAndTab, clearWaiterRequested, getTableById, getTableByRestaurantId, getActiveOrders, updateOrder } = require('../datamodels');

const updateOrderController = async (req, res) => {
	const { body: { status }, params: { orderId } } = req;
	if (!status || !orderId) {
		return res.status(404).send({ message: 'Status and order id are required' });
	} else {
		try {
			const result = await updateOrder(orderId, status);
			res.send(result);
		} catch (error) {
			console.log(error);
			res.status(500);
		}
	}
};

const getActiveOrdersController = async (req, res) => {
	const { params: { restaurantId } } = req;

	if (!restaurantId) {
		return res.status(404).send({ message: 'Restaurant id is required' });
	}

	try {
		const result = await getActiveOrders(restaurantId);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};

const getTableByRestaurantIdController = async (req, res) => {
	const { params: { restaurantId } } = req;

	if (!restaurantId) {
		return res.status(404).send({ message: 'Restaurant id is required' });
	}

	try {
		const result = await getTableByRestaurantId(restaurantId);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};

const getTableByIdController = async (req, res) => {
	const { params: { tableId } } = req;

	if (!tableId) {
		return res.status(404).send({ message: 'Table id is required' });
	}

	try {
		const result = await getTableById(tableId);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

const closeTableController = async (req, res) => {
	const { params: { tableId } } = req;

	if (!tableId) {
		return res.status(404).send({ message: 'Table id is required' });
	}

	try {
		const result = await closeTableAndTab(tableId);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500);
	}
};

const callWaiterController = async (req, res) => {
	const { params: { tabId } } = req;

	if (!tabId) {
		return res.status(404).send({ message: 'Tab id is required' });
	}
	try {
		const result = await clearWaiterRequested(tabId);
		res.send(result);
	} catch (error) {
		console.log(error);
		res.status(500);
	}

};


module.exports = {
	updateOrderController,
	getActiveOrdersController,
	getTableByRestaurantIdController,
	getTableByIdController,
	closeTableController,
	callWaiterController,
};
