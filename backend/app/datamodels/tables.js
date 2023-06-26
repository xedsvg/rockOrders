const { Tables } = require('../db/models');
const { newTab } = require('./tabs');

const getRandomTable = async (restaurantId) => {
	const randomTable = await Tables.findOne({ restaurantId });
	if (!randomTable) {
		throw new Error('No tables found for this restaurant');
	} else {
		const table = await getTable(randomTable._id);
		return table;
	}
};

const getTable = async (tableId, pin) => {
	const table = await Tables.findById(tableId);

	if (!table) {
		throw new Error('Table not found');
	}

	if (table.locked && table.pin !== pin) {
		throw new Error('Incorrect pin');
	}

	if (!table.tabOpen) {
		const currentNewTab = await newTab(table);
		table.currentTab = currentNewTab._id;
		table.tabOpen = true;
		await table.save();
	}

	const populatedTable = await populateTableData(table);

	return populatedTable;
};

const closeTable = async (tableId, session) => {
	const table = await Tables.findById(tableId).session(session);

	if (!table) {
		throw new Error('Table not found');
	}

	if (!table.currentTab) {
		throw new Error('No current tab for the table');
	}
	const currentTab = table.currentTab;
	table.olderTabs.push(table.currentTab);
	table.currentTab = null;
	table.tabOpen = false;
	table.lastUpdated = Date.now();

	await table.save({ session });

	return { table, tabId: currentTab };
};

const getTableById = async (tableId) => {
	const table = await Tables.findById(tableId).populate({
		path: 'currentTab',
		populate: {
			path: 'orders',
			populate: {
				path: 'items',
				populate: {
					path: 'recipe'
				}
			}
		}
	}).exec();

	if (!table) {
		throw new Error('Table not found');
	}

	return table;
};

const getTableByRestaurantId = async (restaurantId) => {
	const table = await Tables.find({ restaurantId }).populate({
		path: 'currentTab',
		populate: {
			path: 'orders',
			populate: {
				path: 'items',
				populate: {
					path: 'recipe'
				}
			}
		}
	}).exec();

	if (!table) {
		throw new Error('Table not found');
	}

	return table;
};

const getTableStatus = async (tableId) => {
	const table = await Tables.findById(tableId);

	if (!table) {
		throw new Error('Table not found');
	}

	if (table.locked) {
		throw new Error('Table is locked');
	}

	return true;
};

const populateTableData = async (table) => {
	return await table.populate({
		path: 'currentTab',
		populate: {
			path: 'orders',
			options: { sort: { createdAt: -1 } },
			populate: {
				path: 'items',
				populate: {
					path: 'recipe'
				}
			}
		}
	}).execPopulate();
};

module.exports = {
	getTable,
	getRandomTable,
	closeTable,
	getTableStatus,
	getTableByRestaurantId,
	getTableById,
};

// TODO: refactor the getTableById and getTable to only one function and make necceary changes in the frontend