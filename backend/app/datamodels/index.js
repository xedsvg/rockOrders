const { closeTableAndTab } = require('./tablesAndTabs');
const { clearWaiter } = require('./tabs');
const { getTableByRestaurantId, getTableById } = require('./tables');
const { getActiveOrders, updateOrder, createNewOrder } = require('./orders');
const { getRestaurantFromHostname, getRestaurantFromId, getRestaurantFromName } = require('./restaurants');


module.exports = {
    closeTableAndTab,
    clearWaiter,
    getTableByRestaurantId,
    getTableById,
    getActiveOrders,
    updateOrder,
    createNewOrder,
    getRestaurantFromHostname,
    getRestaurantFromId,
    getRestaurantFromName,
}