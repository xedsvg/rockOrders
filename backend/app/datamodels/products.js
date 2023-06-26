const { Products } = require('../db/models');

const getProducts = async (restaurantId) => {
	const products = await Products.find({
		restaurantId,
		type: {
			$in: ['product', 'variation']
		}
	})
		.populate('recipe').exec();

	return products;
};

module.exports = {
	getProducts
};
