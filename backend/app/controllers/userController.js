const { Tables, Products, Orders, Tabs } = require("../db/models");

const getMenu = async (req, res) => {
  const id = req.params.id;

  const menu_card = await Products.find({ restaurantId: id });

  res.send(menu_card);
};

const getRandomTable = async (req, res) => {
  if (!req.params.restaurantId) {
    res.sendStatus(400);
  } else {
    const { params: { restaurantId } } = req;

    const randomTable = await Tables.findOne({ restaurantId });
    const { _id = null } = randomTable || {};
    res.send({ _id });
  }
};

const getTable = async (req, res) => {
  const { params: { tableId } } = req;

  try {
    let table = await Tables.findById(tableId);
    if (!table) {
      res.sendStatus(404);
    }
    else {
      if (!table.tabOpen) {
        const newTab = await new Tabs({
          restaurantId: table.restaurantId,
          tableId: table._id,
          status: "open",
          lastUpdated: Date.now(),
          createdAt: Date.now()
        }).save();

        table.currentTab = newTab._id;
        table.tabOpen = true;
        table = await table.save();
      }

      table = await table.populate({
        path: 'currentTab',
        populate: {
          path: 'orders',
          options: { sort: { createdAt: -1 } },
          populate: {
            path: 'items'
          }
        }
      }).execPopulate();
      res.send(table);

    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

};

const getTab = async (req, res) => {
  const { params: { tabId } } = req;

  try {
    let tab = await Tabs.findById(tabId);
    if (!tab) {
      res.sendStatus(404);
    } else {
      tab = await tab.populate('orders').execPopulate();
      res.send(tab);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

// const openTab = async (req, res) => {
//   const { body: { restaurantId } } = req;
//   if(!restaurantId) {
//     res.sendStatus(400);
//   } else {
//     try {
//     const order = await Orders.find(orderId);
//     res.send(order);
//   } catch (e) {
//     res.send(500);
//   }}
// };

const newOrder = async (req, res) => {
  const { body: { cartProducts }, params: { tabId } } = req;
  if (!cartProducts || !tabId) {
    res.sendStatus(400);
  } else {
    try {
      const tab = await Tabs.findById(tabId);
      if (!tab) {
        res.sendStatus(404);
      } else {
        const totalAmount = cartProducts.reduce((total, cartProduct) => total + parseInt(cartProduct.qty) * parseFloat(cartProduct.price.toFixed(2)), 0);
        const items = cartProducts.flatMap(({ qty, _id }) => Array(qty).fill(_id));
        // const variations = cartProducts.flatMap(({id, variation}) => Array(qty).fill({id, variation}));
        const order = new Orders({
          tabId: tab._id,
          restaurantId: tab.restaurantId,
          totalAmount,
          items
        });
        tab.orders.push(order._id);

        await Promise.all([order.save(), tab.save()]);
        res.send(order);
      }
    } catch (e) {
      res.sendStatus(500);
    }
  }
};

const getOrder =  async (req, res) => {
  const { params: { orderId } } = req;
  if (!orderId) {
    res.sendStatus(400);
  } else {
    try {
      const order = await Orders.findById(orderId);
      res.send(order);
    } catch (e) {
      res.send(500);
    }
  }
};

const getTableStatus = async (req, res) => {
  const { params: { tableId } } = req;
  if (!tableId) {
    res.sendStatus(404);
  } else {
    try {
      const table = await Tables.findById(tableId);
      if(table.locked) {
        res.send({
          locked: "true",
          nextStep: "sendPin"
        });
      } else {
        res.send(table);
      }
    } catch (e) {
      res.send(500);
    }
  }
};

module.exports = {
  getMenu,
  getRandomTable,
  getTable,
  getTab,
  newOrder,
  getOrder
};
