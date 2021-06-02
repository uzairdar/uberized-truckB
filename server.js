const express = require("express");
const cors = require("cors");
// const io = require("./socket");

const http = require("http");
const mongoose = require("mongoose");
const uri =
  "mongodb://wixuser:user123@uberizedtruck-shard-00-00.rrliq.mongodb.net:27017,uberizedtruck-shard-00-01.rrliq.mongodb.net:27017,uberizedtruck-shard-00-02.rrliq.mongodb.net:27017/uberizedTruck?ssl=true&replicaSet=atlas-goda39-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
const port = process.env.PORT || 5000;
let clients = [];

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongoose Connection established");
});

app.use(cors());
app.use(express.json());
const userRouter = require("./routes/User");
const vehicleRouter = require("./routes/Vehicle");
app.use("/api/vehicle", vehicleRouter);
app.use("/api/user", userRouter);
const server = http.createServer(app);
const io = require("./socket.js");
io.connect(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("storeClientInfo", function (data) {
    var clientInfo = new Object();
    clientInfo.userId = data.userId;
    clientInfo.clientId = socket.id;
    // let userAlreadyExists = false;

    // for (let i = 0; i < clients.length; i++) {
    //   if (clients[i].userId === data.userId) {
    //     userAlreadyExists = true;
    //     break;
    //   }
    // }
    let userAlreadyExists = clients.find((c) => {
      if (c.userId === data.userId) {
        return true;
      } else {
        return false;
      }
    });
    console.log("User exists then true ", userAlreadyExists);
    if (!userAlreadyExists) {
      clients.push(clientInfo);
    }
    console.log("It starts here ", clients, "THis is our cients array");
  });
  socket.on("setLocationData", function (data) {
    console.log("locationData", data);
  });
});

try {
  //   io.connect(server);
  //   io.on("connect", (socket) => {
  //     console.log("New Socket connected ", socket.id, clients);
  //     socket.on("storeClientInfo", function (data) {
  //       var clientInfo = new Object();
  //       clientInfo.userId = data.userId;
  //       clientInfo.clientId = socket.id;
  //       let userAlreadyExists = clients.find((c) => {
  //         if (c.userId === data.userId) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       });
  //       console.log("User exists then true ", userAlreadyExists);
  //       if (!userAlreadyExists) {
  //         clients.push(clientInfo);
  //       }
  //       console.log("It starts here ", clients, "THis is our cients array");
  //     });
  //     socket.emit("test", { data: "hello from server " });
  //     socket.on("follow-user-notification", (data) => {
  //       const { userId, followingId } = data;
  //       const socketIdOfUserBeingFollowed = clients.find(
  //         (client) => client.userId === followingId
  //       );
  //       if (!socketIdOfUserBeingFollowed) {
  //         console.log(
  //           "User not currently connected ",
  //           socketIdOfUserBeingFollowed
  //         );
  //         return;
  //       }
  //       socket
  //         .to(socketIdOfUserBeingFollowed.clientId)
  //         .emit("someone-followed-you", userId);
  //     });
  //     socket.on("message-notification", (data) => {
  //       console.log("message", data.room.messages);
  //       const { senderId, recieverId, room } = data;
  //       const socketIdOfReciever = clients.find(
  //         (client) => client.userId === recieverId
  //       );
  //       if (!socketIdOfReciever) {
  //         const emailNeedToBeSent = emailReceiverClients.find(
  //           (client) => client === recieverId
  //         );
  //         if (!emailNeedToBeSent) {
  //           sendEmail(
  //             recieverId,
  //             senderId,
  //             data.room.messages[data.room.messages.length - 1].body.value
  //           );
  //           emailReceiverClients.push(recieverId);
  //         }
  //         console.log("email receiver", emailReceiverClients);
  //         console.log("User not currently connected ", socketIdOfReciever);
  //         return;
  //       } else {
  //         console.log("Socket event trigred");
  //         socket
  //           .to(socketIdOfReciever.clientId)
  //           .emit("someone-sent-a-message", { senderId, room });
  //       }
  //     });
  //     socket.on("disconnect", function (data) {
  //       for (var i = 0, len = clients.length; i < len; ++i) {
  //         var c = clients[i];
  //         if (c.clientId == socket.id) {
  //           clients.splice(i, 1);
  //           break;
  //         }
  //       }
  //       console.log("client disconnected", data, clients);
  //     });
  //   });
  //   console.log("bahtreen");
} catch (error) {
  // console.log("Socekt error ", error);
}

server.listen(port, () => {
  console.log("Socket listening on port : ", port);
});
