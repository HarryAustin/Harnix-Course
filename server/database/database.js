const mongoose = require("mongoose");

const connectDB = async (cb) => {
  const options = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI_PROD,
      options
    );
    console.log(`connected at ${connection.connection.host}`);
    return cb();
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
