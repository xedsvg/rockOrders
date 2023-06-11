const { Tabs } = require('../db/models');

const getTab = async (tabId) => {
	let tab = await Tabs.findById(tabId);
	if (!tab) {
		throw new Error('Tab not found');
	} else {
		tab = await tab.populate('orders').execPopulate();
		return tab;
	}
};

const closeTab = async (tabId, session) => {
	const tab = await Tabs.findById(tabId).session(session);

	if (!tab) {
		throw new Error('Tab not found');
	}

	tab.status = 'closed';
	tab.lastUpdated = Date.now();

	await tab.save({ session });

	return tab;
};

const clearWaiterRequested = async (tabId) => {
	const tab = await Tabs.findById(tabId);

	if (!tab) {
		throw new Error('Tab not found');
	}

	tab.callWaiter = null;
	await tab.save();

	return tab;
};

const waiterRequested = async (tabId) => {
	const tab = await Tabs.findById(tabId);
	if (!tab) {
		throw new Error('Tab not found');
	}
	if (tab.callWaiter === 'called') {
		throw new Error('Waiter already called');
	}
	if (tab.status === 'closed') {
		throw new Error('Tab closed');
	} else {
		tab.callWaiter = 'called';
		await tab.save();
	
		return true;
	}
};

const paymentRequested = async (tabId, paymentType, tipsPercent) => {
	const tab = await Tabs.findById(tabId);
	if (!tab) {
		throw new Error('Tab not found');
	}
	if (tab.status === 'closed') {
		throw new Error('Tab closed');
	}
	
	tab.paymentRequested = paymentType;
	if (tipsPercent) {
		tab.tipsPercent = tipsPercent;
	}
	await tab.save();

	return true;
};

const newTab = async (table) => {
	const newTab = await new Tabs({
		restaurantId: table.restaurantId,
		tableId: table._id,
		status: 'open',
		lastUpdated: Date.now(),
		createdAt: Date.now()
	}).save();
	return newTab;
};

module.exports = {
	getTab,
	closeTab,
	newTab,
	waiterRequested,
	clearWaiterRequested,
	paymentRequested
};
