const mongoose = require('mongoose');
const { Schema: { Types: { ObjectId } } } = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: String,
    OwnerName: String,
    //open hours - todo for last order before!
});
const Restaurants = mongoose.model("Restaurants", restaurantSchema);

const tableSchema = new mongoose.Schema({
    restaurantId: String,
    tableNo: Number,
    tabOpen: Boolean,
    date: Date
});
const Tables = mongoose.model("Tables", tableSchema);

const productSchema = new mongoose.Schema({
    restaurantId: {
        type: ObjectId,
        ref: Restaurants
    },
    name: String,
    price: Number,
    stock: Number,
    alcoholContent: String,
    contains: String,
    description: String,
    variation: Array,
    volume: String,
    subCategory: String,
    quantity: Number,
    restaurantId: String,
    category: String,
    imgUrl: String,
});
const Products = mongoose.model("Products", productSchema);

const tabSchema = new mongoose.Schema({
    restaurantId: String,
    tableId: {
        type: ObjectId,
        ref: Tables
    },
    status: String, // closed-open
    lastUpdated: Date,
    createdAt: Date
});
const Tabs = mongoose.model("Tabs", tabSchema);

const orderSchema = new mongoose.Schema({
    status: String, // received, inProgress, done
    restaurantId: String,
    tabId: {
        type: ObjectId,
        ref: Tabs
    },
    items: String,
    totalAmount: Number,
});
const Orders = mongoose.model("Orders", orderSchema);

const serverSchema = new mongoose.Schema({
    restaurantId: {
        type: ObjectId,
        ref: Restaurants
    },
    name: String,
    enabled: Boolean,
    createdAt: Date
});
const Servers = mongoose.model("Servers", serverSchema);

module.exports = {
    Restaurants,
    Tables,
    Products,
    Orders,
    Tabs,
    Servers
}