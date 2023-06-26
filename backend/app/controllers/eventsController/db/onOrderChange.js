const { Orders } = require('../../../db/models');

module.exports = async (mongoEvent, io) => {
	if (mongoEvent.operationType === 'insert') {
		const ownerRoomName = `${mongoEvent.fullDocument.restaurantId}:owner`;
		const tabRoomName = `${mongoEvent.fullDocument.restaurantId}:${mongoEvent.fullDocument.tabId}`;
		//todo remove duplicate code from here. make a function that returns 
		//the order and use it here and in controllers
		const order = await Orders.findById(mongoEvent.fullDocument._id)
			.populate({
				path: 'items',
				populate: {
					path: 'recipe'
				}
			})
			.populate({
				path: 'tabId',
				populate: {
					path: 'tableId'
				}
			}).exec();

		io.to(ownerRoomName).emit('order:new', { order });
		console.log(`New order sent in room: "${ownerRoomName}"`);

		io.to(tabRoomName).emit('order:new', { order });
		console.log(`New order sent in room: "${tabRoomName}"`);
	}

	if (mongoEvent.operationType === 'update') {
		const order = await Orders.findById(mongoEvent.documentKey._id);
		const ownerRoomName = `${order.restaurantId}:owner`;
		const tabRoomName = `${order.restaurantId}:${order.tabId}`;
        
		io.to(ownerRoomName).emit('order:update', { id: order._id, status: order.status });
		console.log(`New order update sent in room: "${ownerRoomName}"`);

		io.to(tabRoomName).emit('order:update', { id: order._id, status: order.status });
		console.log(`New order update sent in room: "${tabRoomName}"`);
        

	}
};