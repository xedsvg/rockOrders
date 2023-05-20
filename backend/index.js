const http = require("http");
const socketIo = require("socket.io");
const { connectToDatabase, dbUrl } = require("./app/db/connection");
const { createApp, createCollectionWatcher, createSocketHandler } = require("./app");

const app = createApp();
const server = http.createServer(app);
const io = socketIo(server);
createSocketHandler(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await connectToDatabase();
    await createCollectionWatcher(io);
    console.log("Connection established to MongoDB...");
    console.log(`Listening on port ${PORT}..`);
  } catch (error) {
    console.log("Could not connect to MongoDB...", error);
  }
});
