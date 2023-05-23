const { Tabs, Tables } = require("../../../db/models");

module.exports = async (mongoEvent, io) => {
    if (mongoEvent.operationType === "update") {
        if (mongoEvent.updateDescription.updatedFields?.callWaiter === 'called') {
            const tab = await Tabs.findById(mongoEvent.documentKey._id)
            .populate('tableId')
            .exec();
            const ownerRoomName = `${tab.restaurantId}:owner`;
            io.to(ownerRoomName).emit("waiter:notification", { tableNo: tab.tableId.tableNo, tabId: tab._id });
            console.log(`New waiter request sent in room: "${ownerRoomName}"`);
        }

    }
};