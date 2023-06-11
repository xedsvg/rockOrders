const { closeTableAndTab } = require('./tablesAndTabs');
const { getTab, closeTab, newTab, waiterRequested, clearWaiterRequested, paymentRequested } = require('./tabs');
const { getTable, getRandomTable, closeTable, getTableStatus, getTableByRestaurantId, getTableById } = require('./tables');
const { getOrder, getActiveOrders, updateOrder, createNewOrder } = require('./orders');
const { getRestaurantByHostname, getRestaurantById, getRestaurantByName } = require('./restaurants');
const { getProducts } = require('./products');

module.exports = {
	closeTableAndTab,
	
	getTab,
	closeTab,
	newTab,
	waiterRequested,
	clearWaiterRequested,
	paymentRequested,

	getTable,
	getRandomTable,
	closeTable,
	getTableStatus,
	getTableByRestaurantId,
	getTableById,

	getOrder,
	getActiveOrders,
	updateOrder,
	createNewOrder,
    
	getRestaurantById,
	getRestaurantByName,
	getRestaurantByHostname,

	getProducts,
};