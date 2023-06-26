const { Orders, Tabs } = require('../db/models');

const getOrder = async (orderId) => {
	const order = await Orders.findById(orderId);
	if (!order) {
		throw new Error('Order not found');
	}

	return order;
};

const getActiveOrders = async (restaurantId) => {
	const orders = await Orders.find({
		restaurantId,
		status: { $in: ['recieved', 'inProgress'] }
	})
		.populate({ 
			path:'items',
			populate: {
				path: 'recipe',
			}
		})
		.populate({
			path: 'tabId',
			populate: {
				path: 'tableId'
			}
		}).exec();
	return orders;
};

const updateOrder = async (orderId, status) => {
	if (!['received', 'inProgress', 'done', 'canceled'].some((msg) => msg === status)) {
		throw new Error('Invalid status');
	} else {
		try {
			const order = await Orders.findById(orderId);
			if (!order) {
				throw new Error('Order not found');
			} else {
				order.status = status;
				await order.save();
				return order;
			}
		} catch (e) {
			throw new Error('Error updating order');
		}
	}
};

const createNewOrder = async (cartProducts, tabId) => {
	const tab = await Tabs.findById(tabId);
	if (!tab) {
		throw new Error('Tab not found');
	} else if (tab.status === 'closed') {
		throw new Error('Tab closed');
	} else {
		const totalAmount = cartProducts.reduce(
			(total, cartProduct) => {
				if(cartProduct.type === 'product'){
					return total + parseInt(cartProduct.cartQty) * parseFloat(cartProduct.price.toFixed(2));
				}
				else if(cartProduct.type === 'variation') {
					return total + parseInt(cartProduct.cartQty) * parseFloat(cartProduct.recipe[0].price.toFixed(2));
				}
				else return 0;
			}, 0);
                
		//grab all the product ids from the products array and put them into a new array. if a product has a cartQty of 3, it will be added 3 times
		const items = cartProducts.flatMap(({ cartQty, _id }) => Array(cartQty).fill(_id));
                    
		//grab all the cartProducts that are variations and the recipie[0] in an object with the cart product id and recipie[0]._id
		const variations = cartProducts.flatMap(({_id, type, recipe, cartQty}) => {
			if(type === 'variation') {
				return Array(recipe[0].cartQty).fill({id: _id, recipe: recipe[0]._id, qty: cartQty});
			}
			else return [];
		});

		const order = new Orders({
			tabId: tab._id,
			restaurantId: tab.restaurantId,
			totalAmount,
			items,
			variations
		});
		tab.orders.push(order._id);
                
		await Promise.all([order.save(), tab.save()]);
		return order;

	}
};

module.exports = {
	getOrder,
	getActiveOrders,
	updateOrder,
	createNewOrder,
};