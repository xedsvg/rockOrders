module.exports = (mongoEvent, io) => {
    console.log("Orders collection:", mongoEvent.operationType, mongoEvent.fullDocument);
    if (mongoEvent.operationType === "insert") {
        const roomName = `${mongoEvent.fullDocument.restaurantId}:owner`;
        console.log(roomName);
        io.to(roomName).emit("orders:new", { message: "A new order has been created" });
    }
    if (mongoEvent.operationType === "update") {
        console.log(mongoEvent);
        const roomName = `${mongoEvent.fullDocument.restaurantId}:client`;
        // console.log(roomName);
        // io.to(roomName).emit("orders:update", { message: mongoEvent.fullDocument.status });
    }
};