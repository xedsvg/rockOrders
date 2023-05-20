const { CollectionWatcher } = require("../db/collectionWatcher");
const { dbUrl } = require("../db/connection");

const onConnection = require("../controllers/eventsController/socket/onConnect");
const onDisconnect = require("../controllers/eventsController/socket/onDisconnect");
const onSendPin = require("../controllers/eventsController/socket/onSendPin");

const onOrderChange = require("../controllers/eventsController/db/onOrderChange");

const createCollectionWatcher = async (io) => {
    const mongoEvents = new CollectionWatcher();
    await mongoEvents.init(dbUrl);
    mongoEvents.subscribeToCollection("orders");
    
    mongoEvents.on("orders:change", (mongoEvent) => {
        onOrderChange(mongoEvent, io);
    });
    
};

const socketIOEventsHandler = (io) => {
    io.on("connection", (socket) => {
        onConnection(socket);

        socket.on("disconnect", () => {
            onDisconnect(socket);
        });

        socket.on("sendPin", (data) => {
            onSendPin(socket, data);
        });

    });
};

module.exports = {
    createCollectionWatcher,
    createSocketHandler: socketIOEventsHandler,
};