const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

conn(); //calling the async function, to connect to MongoDB
