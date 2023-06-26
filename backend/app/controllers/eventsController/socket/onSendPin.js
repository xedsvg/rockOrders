const { Tables } = require('../../../db/models');

module.exports = async (socket, data) => {
	const { pin, tableId } = data;
	if(!pin || !tableId) {
		socket.emit('tableLockStatus', { error: 'Invalid pin or tableId' });
		return;
	}
    
	const table = await Tables.findById(tableId);
	if(table.pin === pin) {
		socket.emit('tableLockStatus', { });
	}
};