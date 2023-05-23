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
  const { params: { tableId, pin } } = req;

  try {
    const table = await findTable(tableId);

    if (!table.tabOpen) {
      const newTab = await createNewTab(table);
      table.currentTab = newTab._id;
      table.tabOpen = true;
      await table.save();
    }

    if (table.locked && table.pin !== pin) {
      res.sendStatus(403);
    } else {
      const populatedTable = await populateTableData(table);
      res.send(populatedTable);
    }
  } catch (e) {
    console.log(e);
    if (e.message === 'Table not found') {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
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

const getOrder = async (req, res) => {
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
      if (table.locked) {
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

const findTable = async (tableId) => {
  const table = await Tables.findById(tableId);
  if (!table) {
    throw new Error('Table not found');
  }
  return table;
};

const createNewTab = async (table) => {
  const newTab = await new Tabs({
    restaurantId: table.restaurantId,
    tableId: table._id,
    status: "open",
    lastUpdated: Date.now(),
    createdAt: Date.now()
  }).save();
  return newTab;
};

const populateTableData = async (table) => {
  return await table.populate({
    path: 'currentTab',
    populate: {
      path: 'orders',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'items'
      }
    }
  }).execPopulate();
};

const callWaiter = async (req, res) => {
  const { params: { tabId } } = req;
  if (!tabId) {
    res.sendStatus(404);
  } else {
    try {
      //find table that has OpenTab === tabId
      const tab = await Tabs.findById(tabId);
      if (!tab) {
        res.sendStatus(404);
      }
      tab.callWaiter = 'called';
      await tab.save();
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  }
};

const payCard = async (req, res) => {
  const { params: { tabId } } = req;
  if (!tabId) {
    res.sendStatus(404);
  } else {
    try {
      //find table that has OpenTab === tabId
      const table = await Tables.findOne({ currentTab: tabId });
      if (!table) {
        res.sendStatus(404);
      }
      table.waiterCalled = true;
      await table.save();
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
};

const payCash = async (req, res) => {
  const { params: { tabId } } = req;
  if (!tabId) {
    res.sendStatus(404);
  } else {
    try {
      const table = await Tables.findById(tableId);
      if (!table) {
        res.sendStatus(404);
      } else {
        table.waiterCalled = true;
        await table.save();
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
  getOrder,
  callWaiter,
  payCard,
  payCash
};
