const { getRestaurantFromId, getRestaurantFromName, getRestaurantFromHostname } = require('../datamodels');

const getRestaurantById = async (req, res) => {
  const { params: { restaurantId } } = req;
  console.log(req.params);

    try {
      const result = await getRestaurantFromId(restaurantId);
      res.send(result);
    } catch (error) {
      res.sendStatus(404);
    }
};

const getRestaurantByName = async (req, res) => {
  const { params: { restaurantName } } = req;

    try {
      const result = await getRestaurantFromName(restaurantName);
      res.send(result);
    } catch (error) {
      res.sendStatus(404);
    }
};


const hostnameCheck = async (req, res) => {
  const { body: { hostname } } = req;
  if (!hostname) {
    res.sendStatus(404);
  } else {
    try {
      const result = await getRestaurantFromHostname(hostname);
      if(!result) res.sendStatus(404);
      res.send(result);
    } catch (error) {
      res.sendStatus(404);
    }
  }
};

module.exports = {
  getRestaurantById,
  getRestaurantByName,
  hostnameCheck, 
};
