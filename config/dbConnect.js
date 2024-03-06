const mongoose = require("mongoose");

// Connect
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

dbConnect();
