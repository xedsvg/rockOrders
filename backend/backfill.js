const mongoose = require("mongoose");
const { Restaurants, Tables, Products } = require("./app/db/models");

const dummyProducts = [{
  "name": "Tuborg",
  "currency": "RON",
  "price": "10",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "bere",
  "subCategory": "Bottled"
}, {
  "name": "vin",
  "currency": "RON",
  "price": "10",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "Vin"
}, {
  "name": "Alune",
  "currency": "RON",
  "price": "7.5",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "Rontaieli"
}, {
  "name": "Chipsuri",
  "currency": "RON",
  "price": "7.5",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "Rontaieli"
}, {
  "name": "Granini",
  "currency": "RON",
  "price": "10",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "Suc"
},
{
  "name": "RockNRolla",
  "currency": "RON",
  "price": "25",
  "imgUrl": "",
  
  "stock": 1000,
  "active": true,
  "type": "product",
  "category": "Cocktails"
},
{
  "name": "Ceai RockNRolla",
  "description": "Un ceai care te mangaie cu sabia pe suflet",
  "imgUrl": "",
  recipe: [],
  "stock": 1000,
  "active": true,
  "alcoholContent": "6% vol",
  "type": "variation",
  "category": "Ceai"
},
{
  "name": "Ceai Negru",
  "qty": "200",
  "measureUnit": "ml",
  "currency": "RON",
  "price": "18",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "alcoholContent": "6% vol",
  "type": "recipeProduct",
},
{
  "name": "Ceai Verde",
  "qty": "200",
  "measureUnit": "ml",
  "currency": "RON",
  "price": "18",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "alcoholContent": "6% vol",
  "type": "recipeProduct",
},
{
  "name": "B69",
  "currency": "RON",
  "price": "13",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "alcoholContent": "70% vol",
  "type": "product",
  "category": "Shots"
}, {
  "name": "Guinness",
  "currency": "RON",
  "price": "14",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "alcoholContent": "8% vol",
  "type": "product",
  "category": "Bere",
  "subCategory": "Draught"
}, {
  "name": "Tuborg",
  "currency": "RON",
  "price": "11",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "alcoholContent": "5.4% vol",
  "type": "product",
  "category": "Bere",
  "subCategory": "Bottled"
}, {
  "name": "Holsten Wheat",
  "currency": "RON",
  "price": "80",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "alcoholContent": "5.4% vol",
  "alcoholContent": "true",
  "qty": "500",
  "measureUnit": "ml",
  "category": "Bere",
  "subCategory": "3L Tower"
}, {
  "name": "Weihenstephaner Hefe Weissbier",
  "currency": "RON",
  "price": "10",
  "category": "Bere",
  "imgUrl": "",
  "stock": 1000,
  "active": true,
  "type": "product",
  "alcoholContent": "5.4% vol",
  "qty": "500",
  "measureUnit": "ml",
  "subCategory": "Bottled"
}];

const restaurant = new Restaurants({
  _id: '641ef47dd6a1260012acd8c7',
  name: "NotRocknRolla",
  ownerName: "Pablo e Sobar"
});

(async () => {
  try {

    await mongoose.connect(`mongodb://${process.env.MONGODB_HOST || 'localhost'}/tabley?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const restaurantDetails = await restaurant.save();
    delete restaurantDetails.__v;
    console.log("/////////////////////////////////////////");
    console.log("/////////////////////////////////////////");
    console.log("/////////////////////////////////////////");
    console.log(restaurantDetails);
    console.log("/////////////////////////////////////////");
    console.log("/////////////////////////////////////////");
    console.log("/////////////////////////////////////////");

    for (let i = 1; i <= 20; i++) {
      await new Tables({
        restaurantId: restaurantDetails._id,
        tableNo: i
      }).save();
      console.log(`Added table nr ${i}`);
    }


    await dummyProducts.map(async (dummyProduct) => {
      const newDummyProduct = new Products({
        ...dummyProduct,
        restaurantId: restaurantDetails._id
      })
      await newDummyProduct.save();
      console.log(`Added product (${dummyProduct.category}) ${dummyProduct.name}`)
    });

    console.log("Done!");

  } catch (e) {
    console.log(e);
  }

})();