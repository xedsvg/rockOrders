const mongoose = require("mongoose");
const { Restaurants, Tables, Products, Waiters } = require("./db/models");

const dummyProducts = [{
  "name": "Tuborg",
  "price": "10",
  "imgUrl": "",
  "stock": 1,
  "category": "bere",
  "subCategory": "Bottled"
}, {
  "name": "vin",
  "price": "10",
  "imgUrl": "",
  "stock": 1,
  "category": "vin"
}, {
  "name": "alune",
  "price": "7.5",
  "imgUrl": "",
  "stock": 1,
  "category": "rontaieli"
}, {
  "name": "chipsuri",
  "price": "7.5",
  "imgUrl": "",
  "stock": 1,
  "category": "rontaieli"
}, {
  "name": "granini",
  "price": "10",
  "imgUrl": "",
  "stock": 1,
  "category": "suc"
},
{
  "name": "RockNRolla",
  "price": "25",
  "imgUrl": "",
  "contains": "rom alb, cointreau, rodie, suc lamaie, sirop de zahar condimentat",
  "stock": 1,
  "category": "cocktails"
},
{
  "name": "Ceai RockNRolla",
  "volume": "200",
  "contains": "ceai infuzie, sirop infuzat cu condimente, suc lamaie, portocala, ananas, cireasa maraschino",
  "description": "Un ceai care te mangaie cu sabia pe suflet",
  "variation": [
    {
      "name": "rom"
    },
    {
      "name": "vodka"
    }
  ],
  "price": "18",
  "imgUrl": "",
  "stock": 1,
  "category": "ceai"
},
{
  "name": "B69",
  "price": "13",
  "imgUrl": "",
  "stock": 1,
  "category": "shots"
}, {
  "name": "Guinness",
  "price": "14",
  "imgUrl": "",
  "stock": 1,
  "category": "bere",
  "subCategory": "Draught"
}, {
  "name": "Tuborg",
  "price": "11",
  "imgUrl": "",
  "stock": 1,
  "category": "bere",
  "subCategory": "Bottled"
}, {
  "name": "Holsten Wheat",
  "price": "80",
  "imgUrl": "",
  "stock": 1,
  "category": "bere",
  "subCategory": "3L Tower"
}, {
  "name": "Weihenstephaner Hefe Weissbier",
  "price": "10",
  "category": "bere",
  "imgUrl": "",
  "stock": 1,
  "alcoholContent": "5.4% vol",
  "volume": "500 ml",
  "subCategory": "Bottled"
}];

const restaurant = new Restaurants({
  _id: '641ef47dd6a1260012acd8c7',
  name: "NotRocknRolla",
  OwnerName: "Pablo e Sobar"
});

(async () => {
  try {

    await mongoose.connect(`mongodb://${process.env.MONGODB_HOST || 'localhost'}/rockandrolla?retryWrites=true&w=majority`, {
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