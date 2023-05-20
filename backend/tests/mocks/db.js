const sinon = require("sinon");
const { Restaurants, Tables, Products, Orders, Tabs } = require("../../app/db/models");

const restaurantsMock = sinon.mock(Restaurants);
const tablesMock = sinon.mock(Tables);
const productsMock = sinon.mock(Products);
const ordersMock = sinon.mock(Orders);
const tabsMock = sinon.mock(Tabs);

module.exports = {
  restaurantsMock,
  tablesMock,
  productsMock,
  ordersMock,
  tabsMock
};
