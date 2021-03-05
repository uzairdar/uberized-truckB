const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const uri =
  "mongodb+srv://wixuser:user123@uberizedtruck.rrliq.mongodb.net/uberizedTruck?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
const port = process.env.PORT || 5000;

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongoose Connection established");
});
app.use(cors());
app.use(express.json());
const userRouter = require("./routes/User");
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log("server is listening on port : ", port);
});
