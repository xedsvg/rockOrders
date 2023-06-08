const { closeTableAndTab } = require('./tablesAndTabs');
const { clearWaiter } = require('./tabs');
const { getTableByRestaurantId, getTableById } = require('./tables');
const { getActiveOrders, updateOrder, createNewOrder } = require('./orders');

module.exports = {
    closeTableAndTab,
    clearWaiter,
    getTableByRestaurantId,
    getTableById,
    getActiveOrders,
    updateOrder,
    createNewOrder,
}