const mongoose = require("mongoose");

const dbUrl = `mongodb://${process.env.MONGODB_HOST || "localhost"}/rockandrolla`;

async function connectToDatabase() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { 
  connectToDatabase,
  dbUrl 
 };
