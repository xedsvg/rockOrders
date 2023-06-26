const { createNewOrder, getProducts, getRandomTable, getTable, getTableStatus, getTab, getOrder, waiterRequested, paymentRequested } = require('../datamodels');

const getMenuController = async (req, res) => {
	if (!req.params.restaurantId) {
		res.sendStatus(400);
	} else {
		const { params: { restaurantId } } = req;

		try {
			const products = await getProducts(restaurantId);
			res.send(products);
		}
		catch (e) {
			console.log(e);
			res.sendStatus(404);
		}
	}
};

const getRandomTableController = async (req, res) => {
	if (!req.params.restaurantId) {
		res.sendStatus(400);
	} else {
		const { params: { restaurantId } } = req;

		try {
			const table = await getRandomTable(restaurantId);
			res.send(table);
		}
		catch (e) {
			console.log(e);
			res.sendStatus(404);
		}
	}
};

const getTableController = async (req, res) => {
	const { params: { tableId, pin } } = req;

	try {
		const table = await getTable(tableId, pin);
		res.send(table);
	} catch (e) {
		console.log(e);
		if (e.message === 'Table not found') {
			res.sendStatus(404);
		} else if (e.message === 'Wrong pin') {
			res.sendStatus(401);
		}
		else {
			res.sendStatus(500);
		}
	}
};

const getTableStatusController = async (req, res) => {
	const { params: { tableId } } = req;
	if (!tableId) {
		res.sendStatus(404);
	} else {
		try {
			await getTableStatus(tableId);
			res.sendStatus(200);
		} catch (e) {
			console.log(e);
			if (e.message === 'Table not found') {
				res.sendStatus(404);
			}
			else if (e.message === 'Table is locked') {
				res.sendStatus(401);
			}
			else {
				res.sendStatus(500);
			}
		}
	}
};

const getTabController = async (req, res) => {
	const { params: { tabId } } = req;

	try {
		const tab = await getTab(tabId);
		res.send(tab);
	}
	catch (e) {
		console.log(e);
		if (e.message === 'Tab not found') {
			res.sendStatus(404);
		}
		else {
			res.sendStatus(500);
		}

	}
};

const newOrderController = async (req, res) => {
	const { body: { cartProducts }, params: { tabId } } = req;
	if (!cartProducts || !tabId) {
		res.sendStatus(400);
	} else {
		try {
			await createNewOrder(cartProducts, tabId);
			res.sendStatus(200);
		} catch (e) {
			console.log(e);
			if (e.message === 'Tab not found') {
				res.sendStatus(404);
			}
			else if (e.message === 'Tab closed') {
				res.sendStatus(401);
			}
			else {
				res.sendStatus(500);
			}
		}
	}
};

const getOrderController = async (req, res) => {
	const { params: { orderId } } = req;
	if (!orderId) {
		res.sendStatus(400);
	} else {
		try {
			const order = await getOrder(orderId);
			res.send(order);
		}
		catch (e) {
			console.log(e);
			if (e.message === 'Order not found') {
				res.sendStatus(404);
			}
			else {
				res.sendStatus(500);
			}
		}
	}
};

const callWaiterController = async (req, res) => {
	const { params: { tabId } } = req;
	if (!tabId) {
		res.sendStatus(404);
	} else {
		try {
			await waiterRequested(tabId);
			res.sendStatus(200);
		} catch (e) {
			console.log(e);
			if (e.message === 'Tab not found') {
				res.sendStatus(404);
			} else if (e.message === 'Tab closed') {
				res.sendStatus(401);
			} else if (e.message === 'Waiter already called') {
				res.sendStatus(429);
			} else {
				res.sendStatus(500);
			}
		}
	}
};

const payCardController = async (req, res) => {
	const { params: { tabId } } = req;
	if (!tabId) {
		res.sendStatus(404);
	} else {
		try {
			await paymentRequested(tabId, 'card');
		} catch (e) {
			console.log(e);
			if (e.message === 'Tab not found') {
				res.sendStatus(404);
			} else if (e.message === 'Tab closed') {
				res.sendStatus(401);
			} else {
				res.sendStatus(500);
			}
		}
	}
};

const payCashController = async (req, res) => {
	const { params: { tabId } } = req;
	if (!tabId) {
		res.sendStatus(404);
	} else {
		try {
			await paymentRequested(tabId, 'cash');
		} catch (e) {
			console.log(e);
			if (e.message === 'Tab not found') {
				res.sendStatus(404);
			} else if (e.message === 'Tab closed') {
				res.sendStatus(401);
			} else {
				res.sendStatus(500);
			}
		}
	}
};

module.exports = {
	getMenuController,
	getRandomTableController,
	getTableController,
	getTableStatusController,
	getTabController,
	newOrderController,
	getOrderController,
	callWaiterController,
	payCardController,
	payCashController,
};
