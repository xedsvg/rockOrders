const { Tabs } = require('../../../db/models');
const propagationDelay = 1000;

module.exports = async (mongoEvent, io) => {
	if (mongoEvent.operationType === 'insert') {
		console.log('Tab inserted');
		// Give some time for the document to be created and propagated
		setTimeout(() => {
			const tab = mongoEvent.fullDocument;
			const ownerRoomName = `${tab.restaurantId}:owner`;

			io.to(ownerRoomName).emit('tab:open', { tableId: tab.tableId, tabId: tab._id });
			console.log(`[Events] [Delayed ${propagationDelay/1000}s] New tab open request sent in room: "${ownerRoomName}"`);
		}, propagationDelay);
	}

	if (mongoEvent.operationType === 'update') {

		// Call waiter
		if (mongoEvent.updateDescription.updatedFields?.callWaiter === 'called') {
			console.log('  ');
			const tab = await Tabs.findById(mongoEvent.documentKey._id)
				.populate('tableId')
				.exec();

			const ownerRoomName = `${tab.restaurantId}:owner`;

			io.to(ownerRoomName).emit('waiter:notification', { tableNo: tab.tableId.tableNo, tabId: tab._id });
			console.log(`[Events] New waiter request sent in room: "${ownerRoomName}"`);
		}

		// Close tab
		if (mongoEvent.updateDescription.updatedFields?.status === 'closed') {
			console.log('  ');
			const tab = await Tabs.findById(mongoEvent.documentKey._id);

			const ownerRoomName = `${tab.restaurantId}:owner`;
			const tabRoomName = `${tab.restaurantId}:${tab._id}`;

			io.to(ownerRoomName).emit('tab:closed', { tableId: tab.tableId, tabId: tab._id });
			console.log(`[Events] Tab closed sent in room: "${ownerRoomName}"`);

			io.to(tabRoomName).emit('tab:closed', { tabId: tab._id });
			console.log(`[Events] Tab closed sent in room: "${tabRoomName}"`);
		}
	}
};