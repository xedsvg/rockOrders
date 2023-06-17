const MongoClient = require('mongodb').MongoClient;
const EventEmitter = require('events');

class CollectionWatcher extends EventEmitter {
	constructor() {
		super();
		this.collections = [];
	}

	async init(clientUrl) {
		this.client = await MongoClient.connect(clientUrl);
	}
	subscribeToCollection(collection) {
		const mongoCollection = this.client.db('tabley').collection(collection);
		const collectionStream = mongoCollection.watch();
    
		this.collections.push(
			{
				[collection]: collectionStream
			});
    
		collectionStream.on('change', (change) => {
			this.emit(`${collection}:change`, change);
		});
	}

}

module.exports = {
	CollectionWatcher
};