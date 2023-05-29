const mongoose = require('mongoose');
const { Tables } = require('../db/models');

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

    return { table, tabId: currentTab }
};

const getTableById = async (tableId) => {
    const table = await Tables.findById(tableId).populate({
        path: 'currentTab',
        populate: {
            path: 'orders',
            populate: {
                path: 'items'
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
                path: 'items'
            }
        }
    }).exec();

    if (!table) {
        throw new Error('Table not found');
    }

    return table;
};


module.exports = {
    closeTable,
    getTableByRestaurantId,
    getTableById,
};
