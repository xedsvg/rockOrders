const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const createApp = (dependencies = {}) => {
  const app = express();

  app.use(cors());
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