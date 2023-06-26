const { Restaurants } = require('../../../db/models');

module.exports = async (socket) => {
	if(socket.handshake.query.restaurantId){
		let restaurant;
		try {
			restaurant = await Restaurants.findById(socket.handshake.query.restaurantId);
		} catch (error) {
			console.log(error);
		}
		if(restaurant){
			//todo: implement proper authentication of owner
			if(socket.handshake.query.owner === 'true') {
				console.log('Owner from restaurant ' + restaurant.name + ' connected!');
				socket.join(`${socket.handshake.query.restaurantId}:owner`);
				console.log(`Connected owner to room: "${socket.handshake.query.restaurantId}:owner"`);

			} else if (socket.handshake.query.tabId != null){
				console.log('Client from restaurant ' + restaurant?.name + ' connected!');
            
				socket.join(`${socket.handshake.query.restaurantId}:globalNotifications`);
				console.log(`Connected client to room (Global Notifications): "${socket.handshake.query.restaurantId}:globalNotifications"`);

				socket.join(`${socket.handshake.query.restaurantId}:${socket.handshake.query.tabId}`);
				console.log(`Connected client to room (Tab): "${socket.handshake.query.restaurantId}:${socket.handshake.query.tabId}"`);

			} else {
				try {
					delete socket.handshake.query.transport;
					delete socket.handshake.query.EIO;
					delete socket.handshake.query.t;
				} catch (e) {
					console.log('Error deleting query params from socket handshake: ' + e);
				}
				console.log('Disconnected client that had the following query: ' + JSON.stringify(socket.handshake.query));
				socket.disconnect();
			}
		}

	}

};