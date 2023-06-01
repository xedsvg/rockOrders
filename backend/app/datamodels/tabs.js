const mongoose = require('mongoose');
const { Tabs } = require('../db/models');

const closeTab = async (tabId, session) => {
    const tab = await Tabs.findById(tabId).session(session);

    if (!tab) {
        throw new Error('Tab not found');
    }

    tab.status = 'closed';
    tab.lastUpdated = Date.now();

    await tab.save({ session });

    return tab;
}

const clearWaiter = async (tabId) => {
    const tab = await Tabs.findById(tabId);

    if (!tab) {
        throw new Error('Tab not found');
    }

    tab.callWaiter = null;
    await tab.save();

    return tab;
}

module.exports = {
    closeTab,
    clearWaiter,
};
