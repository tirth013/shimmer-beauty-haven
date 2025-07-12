const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `Database connected successfully! Host: ${connect.connection.host}, Name: ${connect.connection.name}`
    );
  } catch (err) {
    console.error(
      "[Database Connection Error] Unable to connect to MongoDB:",
      err.message
    );
    process.exit(1);
  }
};

module.exports = connectDb;
