require('dotenv').config();
const mongoose = require('mongoose');

const connectTestDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    ssl: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  });
};

const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = { connectTestDB, disconnectTestDB };