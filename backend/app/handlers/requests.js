const compression = require('compression');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const createApp = (dependencies = {}) => {
  const app = express();

  let origins = [];
  setInterval(() => {
    try{
      delete require.cache[require.resolve("../../cors.json")];
      origins = require("../../cors.json").origins;
    } catch(e) {
      console.log("Error reading cors.json file");
    }
    }, 60000);

  app.use(compression({ filter: (req, res) => true, level: 6, algorithms: ['br', 'gzip', 'deflate'] }));
  app.use(cors({
    origin: function (origin, callback) {
      if (origins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log("Express: Blocked by CORS: " + origin);
        callback(new Error('Not allowed by CORS'))
      }
    }
  }));
  app.use(express.json());
  app.use(helmet());

  app.use("/api/user", dependencies.userRoutes || require("../routes/userRoutes"));
  app.use("/api/owner", dependencies.ownerRoutes || require("../routes/ownerRoutes"));
  app.use("/api/status", dependencies.statusRoutes || require("../routes/statusRoutes"));
  app.use("/api/app", dependencies.appRoutes || require("../routes/appRoutes"));
  return app;
}

module.exports = {
    createApp
}