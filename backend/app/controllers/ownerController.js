const { closeTableAndTab, clearWaiter, getTableById, getTableByRestaurantId, getActiveOrders, updateOrder } = require('../datamodels');

const updateOrderStatus = async (req, res) => {
  const { body: { status }, params: { orderId } } = req;
  if (!status || !orderId) {
    return res.status(404).send({ message: "Status and order id are required" });
  } else {
    try {
      const result = await updateOrder(orderId, status);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  }
};

const returnActiveOrders = async (req, res) => {
  const { params: { restaurantId } } = req;

  if (!restaurantId) {
    return res.status(404).send({ message: "Restaurant id is required" });
  }

  try {
    const result = await getActiveOrders(restaurantId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const getTables = async (req, res) => {
  const { params: { restaurantId } } = req;

  if (!restaurantId) {
    return res.status(404).send({ message: "Restaurant id is required" });
  }

  try {
    const result = await getTableByRestaurantId(restaurantId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const getTable = async (req, res) => {
  const { params: { tableId } } = req;

  if (!tableId) {
    return res.status(404).send({ message: "Table id is required" });
  }

  try {
    const result = await getTableById(tableId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const closeTable = async (req, res) => {
  const { params: { tableId } } = req;

  if (!tableId) {
    return res.status(404).send({ message: "Table id is required" });
  }

  try {
    const result = await closeTableAndTab(tableId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
}

const clearCallWaiter = async (req, res) => {
  const { params: { tabId } } = req;

  if (!tabId) {
    return res.status(404).send({ message: "Tab id is required" });
  }

  try {
    const result = await clearWaiter(tabId);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }

};


module.exports = {
  updateOrder: updateOrderStatus,
  getActiveOrders: returnActiveOrders,
  getTable,
  getTables,
  clearCallWaiter,
  closeTable,
};
