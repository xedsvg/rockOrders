const fs = require("fs");
const https = require("https");
const http = require("http");

const socketIo = require("socket.io");
const { connectToDatabase, dbUrl } = require("./app/db/connection");
const { createApp, createCollectionWatcher, createSocketHandler } = require("./app");

const app = createApp();

const PROD = process.env.NODE_ENV === "production";
const options = {};

if (PROD) {
  if (!process.env.KEY || !process.env.CERT) {
    console.error("Missing KEY or CERT environment variables");
    console.error("Exiting...");
    process.exit(1);
  } else {
    options.key = fs.readFileSync(process.env.KEY);
    options.cert = fs.readFileSync(process.env.CERT);
  }
}
let origins = [];
setInterval(() => {
  try {
    delete require.cache[require.resolve("./cors.json")];
    origins = require("./cors.json").origins;
  } catch (e) {
    console.log("Socket.io: Error reading cors.json file");
  }
}, 60000);

const server = PROD ? https.createServer(options, app) : http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Socket.io: Blocked by CORS: " + origin);
        callback('Not allowed by CORS');
      }
    }
  }
});
createSocketHandler(io);

const PORT = PROD ? 443 : process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDatabase();
    await createCollectionWatcher(io);
    console.log("Connection established to MongoDB...");
    console.log(`Listening on port ${PORT}..`);
  } catch (error) {
    console.log("Could not connect to MongoDB...", error);
  }
});
