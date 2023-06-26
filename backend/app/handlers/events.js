const { CollectionWatcher } = require('../db/collectionWatcher');
const { dbUrl } = require('../db/connection');

const onConnection = require('../controllers/eventsController/socket/onConnect');
const onDisconnect = require('../controllers/eventsController/socket/onDisconnect');

const onOrderChange = require('../controllers/eventsController/db/onOrderChange');
const onTabChange = require('../controllers/eventsController/db/onTabChange');


const createCollectionWatcher = async (io) => {
	const mongoEvents = new CollectionWatcher();
	await mongoEvents.init(dbUrl);
	mongoEvents.subscribeToCollection('orders');
	mongoEvents.subscribeToCollection('tabs');
    
	mongoEvents.on('orders:change', (mongoEvent) => {
		onOrderChange(mongoEvent, io);
	});
    
	mongoEvents.on('tabs:change', (mongoEvent) => {
		onTabChange(mongoEvent, io);
	});
};

const socketIOEventsHandler = (io) => {
	io.on('connection', (socket) => {
		onConnection(socket);

		socket.on('disconnect', () => {
			onDisconnect(socket);
		});
	});
};

module.exports = {
	createCollectionWatcher,
	createSocketHandler: socketIOEventsHandler,
};