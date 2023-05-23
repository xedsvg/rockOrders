const { Restaurants, Orders, Tabs } = require("../db/models");

const updateOrder = async (req, res) => {
  const { body: { status }, params: { orderId } } = req;
  if (!status || !orderId) {
    res.sendStatus(400);
  } else if (!["received", "inProgress", "done", 'canceled'].some((msg) => msg === status)) {
    res.sendStatus(422);
  } else {
    try {
      const order = await Orders.findById(orderId);
      if (!order) {
        res.sendStatus(404);
      } else {
        order.status = status;
        await order.save();
        res.send(order);
      }
    } catch (e) {
      res.send(500);
    }
  }
};

const getActiveOrders = async (req, res) => {
  const { params: { restaurantId } } = req;
  if (!restaurantId) {
    res.sendStatus(400);
  } else {
    try {
      const orders = await Orders.find({
        restaurantId,
        status: { $in: ["recieved", "inProgress"] }
      })
        .populate('items')
        .populate({
          path: 'tabId',
          populate: {
            path: 'tableId'
          }
        }).exec();
      res.send(orders);
    } catch (e) {
      res.sendStatus(500);
    }
  }
};

const clearCallWaiter = async (req, res) => {
  const { params: { tabId } } = req;
  if (!tabId) {
    res.sendStatus(404);
  } else {
    try {
      const tab = await Tabs.findById(tabId);
      if (!tab) {
        res.sendStatus(404);
      }
      tab.callWaiter = null;
      await tab.save();
      res.send({ message: "Cleared call waiter" });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
};


module.exports = {
  updateOrder,
  getActiveOrders,
  clearCallWaiter
};
