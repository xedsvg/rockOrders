const mongoose = require('mongoose');
const { closeTable } = require('./tables');
const { closeTab } = require('./tabs');

const closeTableAndTab = async (tableId) => {
	let session = await mongoose.startSession();

	try {
		session.startTransaction();

		const { table, tabId } = await closeTable(tableId, session);
        
		await closeTab(tabId, session);

		await session.commitTransaction();

		return { message: 'Closed table' };
	} catch (error) {
		console.log('Transaction aborted');
		console.log(error);
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
};

module.exports = {
	closeTableAndTab,
};
