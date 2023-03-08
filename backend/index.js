const startupDebugger = require("debug")("app:startup");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:19006",
};

mongoose
  .connect(`mongodb://${process.env.MONGODB_HOST}/rockandrolla?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection established to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const restaurantSchema = new mongoose.Schema({
  name: String,
  OwnerName: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  restaurantId: String,
  category: String,
  imgUrl: String,
});

const orderSchema = new mongoose.Schema({
  status: String, // received, inProgress, done
  restaurantId: String,
  tableNo: Number,
  items: String,
  totalAmount: Number,
});

const tableSchema = new mongoose.Schema({
  restaurantId: String,
  tableNo: Number,
  date: Date
});

const receiptSchema =  new mongoose.Schema({
  restaurantId: String,
  tableNo: Number,
  status: String, // closed-open
  lastUpdated: Date,
  createdAt: Date
});

const Restaurants = mongoose.model("Restaurants", restaurantSchema);

const Product = mongoose.model("Products", productSchema);

const Order = mongoose.model("Orders", orderSchema);

const Table = mongoose.model("Tables", tableSchema);

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet()); //secures the page by adding various http headers

app.use(morgan("tiny")); // loggs every request in the console
startupDebugger("Morgan enabled");

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

/************   User    ****************/

app.get("/getMenu/:id", async (req, res) => {
  const id = req.params.id;

  const menu_card = await Product.find({ restaurantId: id });
  console.log(menu_card);

  res.send(menu_card);
});

app.post("/placeOrder", async (req, res) => {
  let totAmo = 0,
    itms = [],
    tableNo = req.body.tableNo;
  for (let i = 0; i < req.body.cart.length; i++) {
    totAmo += req.body.cart[i].price * req.body.cart[i].quantity;
    itms[i] = req.body.cart[i].name + " x" + req.body.cart[i].quantity;
  }

  console.log({ totAmo, itms, tableNo });

  const order = new Order({
    restaurantId: req.body.cart[0].restaurantId,
    tableNo: tableNo,
    items: itms.toString(),
    totalAmount: totAmo,
  });

  try {
    const result = await order.save();
    console.log(result);
  } catch (e) {
    for (field in e.errors)
      console.log("Yaha error1!! :-" + e.errors[field].message);
  }

  res.send("accepted");
});

// app.get('/getQrCodeData/:uri', async (req, res) => {

//     let data = req.body.uri;
//     console.log(qr.decode(req.body.uri));

//     res.send(data);
// });

/************   User-End    ****************/

/************   Owner    ****************/

app.get("/getOrders/:id", async (req, res) => {
  const { id } = req.params;

  const order = await Order.find({ restaurantId: id });

  res.send(order);
});

app.delete("/deleteOrder/:id", async (req, res) => {
  const { id } = req.params;

  let order = await Order.findByIdAndDelete(id);

  if (!order) {
    res.status(404).send("The course with the given id was not found");
    return;
  }

  res.send(order);
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

app.get("/login/:id", async (req, res) => {
  const id = req.params.id;
  let restaurantDetails;
  try {
    restaurantDetails = await Restaurants.findById(id);
  } catch (e) {
    console.log(e.message);
  }
  console.log(restaurantDetails);
  restaurantDetails ? res.send(restaurantDetails) : res.send({ _id: -1 });
});

app.post("/addItem", async (req, res) => {
  const obj = req.body;

  const product = new Product(obj);

  try {
    await product.save();

  } catch (e) {
    for (field in e.errors) console.log(e.errors[field].message);
  }

  res.send(obj);
});

/************   Owner-End    ****************/
// const crdate = new Date(Date.now()).toISOString();
// for(let i=1; i< 21; i++) {
//   const table = new Table({
//     restaurantId: "63dc24937a3e728ecda1d982",
//     tableNo: i,
//     Date: crdate
//   });
//   table.save();
// }

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}..`)
});


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