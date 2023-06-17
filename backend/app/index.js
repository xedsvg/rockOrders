const { createApp } = require('./handlers/requests');
const { createCollectionWatcher, createSocketHandler } = require('./handlers/events');

module.exports = {
	createApp,
	createCollectionWatcher,
	createSocketHandler
};