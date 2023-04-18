const helmet = require("helmet");

const mongoose = require("mongoose");
const { Restaurants, Tables, Products, Orders, Tabs, Waiters } = require("./db/models");

const express = require("express");
const cors = require("cors");
const app = express();

// const corsOptions = {
//   origin: "http://localhost:19006",
// };

mongoose.connect(`mongodb://${process.env.MONGODB_HOST || "localhost"}/rockandrolla?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connection established to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(helmet());

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

/************   User    ****************/

app.get("/menus/:id", async (req, res) => {
  const id = req.params.id;

  const menu_card = await Products.find({ restaurantId: id });

  res.send(menu_card);
});

app.get("/getRandomTable/:restaurantId", async (req, res) => {
  if (!req.params.restaurantId) {
    res.sendStatus(400);
  } else {
    const { params: { restaurantId } } = req;

    const randomTable = await Tables.findOne({ restaurantId });
    const { _id = null } = randomTable || {};
    res.send({ _id });
  }
});

app.get("/tables/:tableId", async (req, res) => {
  const { params: { tableId } } = req;

  try {
    let table = await Tables.findById(tableId);
    if (!table) {
      res.sendStatus(204);
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

});

app.get("/tabs/:tabId", async (req, res) => {
  const { params: { tabId } } = req;

  try {
    let tab = await Tabs.findById(tabId);
    if (!tab) {
      res.sendStatus(204);
    } else {
      tab = await tab.populate('orders').execPopulate();
      res.send(tab);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// app.post("/tabs/open", async (req, res) => {
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
// });


app.post("/orders/new/:tabId", async (req, res) => {
  const { body: { cartProducts }, params: { tabId } } = req;
  if (!cartProducts || !tabId) {
    res.sendStatus(400);
  } else {
    try {
      const tab = await Tabs.findById(tabId);
      if (!tab) {
        res.send(204);
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
});

app.get("/orders/:orderId", async (req, res) => {
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
});


/************   Owner-End    ****************/

app.post("/orders/update/:orderId", async (req, res) => {
  const { body: { status }, params: { orderId } } = req;
  if (!status || !orderId) {
    res.sendStatus(400);
  } else if (!["received", "inProgress", "done", 'canceled'].some((msg) => msg === status)) {
    res.sendStatus(422);
  } else {
    try {
      const order = await Orders.findById(orderId);
      if (!order) {
        res.sendStatus(204);
      } else {
        order.status = status;
        await order.save();
        res.send(order);
      }
    } catch (e) {
      res.send(500);
    }
  }
});

app.get("/orders/active/:restaurantId", async (req, res) => {
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
      console.log(orders);
      res.send(orders);
    } catch (e) {
      res.sendStatus(500);
    }
  }
});

app.get("/settings", async (req, res) => {
  const restaurantDetails = await Restaurants.findOne();
  // const restaurantId = "63dc24937a3e728ecda1d982"; /// set this as env or get it from licence server
  // const restaurantName = "RocknRolla"; /// set this as env or get it from licence server

  const restaurantId = restaurantDetails._id;
  const restaurantName = restaurantDetails.name;
  const ownerName = restaurantDetails.OwnerName;

  res.send({
    restaurantId,
    restaurantName,
    ownerName
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}..`)
});

/***************** Helper Functions *****************/
const closeTab = async (tabId) => {
  try {
    const now = Date.now();
    const tab = await Tabs.findById(tabId);

    if (tab.status !== 'closed') {
      tab.status = 'closed';
      tab.lastUpdated = now;
      await tab.save();

      const table = await Restaurants.findById(tab.restaurantId);
      table.olderTabs.push(tab._id);
      table.tabOpen = false;
      table.lastUpdated = now;
      table.currentTab = null;
      await table.save();
      return true;
    } else return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// item = {
//   name: cuba libre
//   category: long drinks
//   description: our signature drink
//   content: rom, cola, lime
//   quantity: 300ml
//   alcohoolContent: 4%
//   variation: null
//   other: lorem ipsum 
//   price: 35
// }