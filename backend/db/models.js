const mongoose = require('mongoose');
const { Schema: { Types: { ObjectId } } } = mongoose;
const { model, Schema } = mongoose;

const restaurantSchema = Schema({
    name: String,
    OwnerName: String,
    //open hours - todo for last order before!
});

const tableSchema = Schema({
    restaurantId: String,
    tableNo: Number,
    tabOpen: Boolean,
    options: Array,
    currentTab: {
        type: ObjectId,
        ref: 'Tabs'
    },
    olderTabs: [{
        type: ObjectId,
        ref: 'Tabs'
    }],
    lastUpdated: Date
});

const productSchema = Schema({
    restaurantId: {
        type: ObjectId,
        ref: 'Restaurants'
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

const tabSchema = Schema({
    restaurantId: {
        type: ObjectId,
        ref: 'Restaurants'
    },
    tableId: {
        type: ObjectId,
        ref: 'Tables'
    },
    orders: [
        {
            type: ObjectId,
            ref: 'Orders'
        }
    ],
    status: String, // request-to-close,closed,open
    callWaiter: String, // called, pending-arival, not-called
    lastUpdated: Date,
    createdAt: Date
});

const orderSchema = Schema({
    status: {
        type:String,
        default: 'recieved'
    }, // received, inProgress, done, canceled
    restaurantId: {
        type: ObjectId,
        ref: 'Restaurants'
    },
    tabId: {
        type: ObjectId,
        ref: 'Tabs'
    },
    items: [{
        type: ObjectId,
        ref: 'Products'
    }],
    // variations: [],
    totalAmount: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const waiterSchema = Schema({
    restaurantId: {
        type: ObjectId,
        ref: 'Restaurants'
    },
    name: String,
    enabled: Boolean,
    createdAt: Date
});

const Restaurants = model("Restaurants", restaurantSchema);
const Tables = model("Tables", tableSchema);
const Products = model("Products", productSchema);
const Tabs = model("Tabs", tabSchema);
const Orders = model("Orders", orderSchema);
const Waiters = model("Waiters", waiterSchema);

module.exports = {
    Restaurants,
    Tables,
    Products,
    Orders,
    Tabs,
    Waiters
}