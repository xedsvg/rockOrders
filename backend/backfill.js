const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://${process.env.MONGODB_HOST}/rockandrolla?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection established to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));


  const dummyProducts = [{
    "name": "bere halba",
    "price": "10",
    "imgUrl": "",
    "stock": 1,
    "category": "bere"
  },{
    "name": "pizza",
    "price": "40",
    "imgUrl": "",
    "stock": 1,
    "category": "pizza"
  },{
    "name": "vin",
    "price": "10",
    "imgUrl": "",
    "stock": 1,
    "category": "vin"
  },{
    "name": "alune",
    "price": "7.5",
    "imgUrl": "",
    "stock": 1,
    "category": "rontaieli"
  },{
    "name": "chipsuri",
    "price": "7.5",
    "imgUrl": "",
    "stock": 1,
    "category": "rontaieli"
  },{
    "name": "granini",
    "price": "10",
    "imgUrl": "",
    "stock": 1,
    "category": "suc"
  },{
    "name": "bere 0.5",
    "price": "10",
    "category": "bere",
    "imgUrl": "",
    "stock": 1
  },{
    "name": "B69",
    "price": "13",
    "imgUrl": "",
    "stock": 1,
    "category": "shots"
  }];

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
  
  const tableSchema = new mongoose.Schema({
    restaurantId: String,
    tableNo: Number,
    date: Date
  });
  
  const Restaurants = mongoose.model("Restaurants", restaurantSchema);
  
  const Product = mongoose.model("Products", productSchema);
    
  const Table = mongoose.model("Tables", tableSchema);

  const restaurant = new Restaurants({
        name: "NotRocknRolla",
        OwnerName: "Not Juan Carlos"
  });

  (async () => {
    try {
        const restaurantDetails = await restaurant.save();
        console.log("/////////////////////////////////////////");
        console.log("/////////////////////////////////////////");
        console.log("/////////////////////////////////////////");
        console.log(restaurantDetails);
        console.log("/////////////////////////////////////////");
        console.log("/////////////////////////////////////////");
        console.log("/////////////////////////////////////////");
        const table = new Table({
            restaurantId: restaurantDetails._id,
            tableNo: 1
        });
        const tableDetails = await table.save();
        dummyProducts.map( async (dummyProduct) => {
            const newDummyProduct = new Product({
                ...dummyProduct,
                restaurantId:restaurantDetails._id
            })
            await newDummyProduct.save();
        });
    
        console.log("Done!");
      } catch (e) {
        console.log(e);
      }

})();