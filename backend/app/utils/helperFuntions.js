const { MongoClient } = require("mongodb");
const { Tabs, Restaurants } = require("../db/models");

async function closeTab(tabId) {
  try {
    const now = Date.now();
    const tab = await Tabs.findById(tabId);

    if (tab.status !== 'closed') {
      tab.status = 'closed';
      tab.lastUpdated = now;
      await tab.save();

      const table = await Restaurants.findById(tab.restaurantId);
      table.olderTabs.push(tab._id);
      table.tabOpen = false;
      table.lastUpdated = now;
      table.currentTab = null;
      await table.save();
      return true;
    } else return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = { closeTab };
