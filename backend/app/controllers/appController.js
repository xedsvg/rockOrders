const { Restaurants } = require("../db/models");

const getSettings = async (req, res) => {
    const { _id: restaurantId, name: restaurantName, ownerName, maxInstances } = await Restaurants.findOne();
  
    res.send({
      restaurantId,
      restaurantName,
      ownerName,
      maxInstances
    });
  };
  
  module.exports = {
    getSettings
  };
  