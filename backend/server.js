const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "POST"],
  },
});

// when user connect
io.on("connection", (socket) => {
  console.log(`User connected : ${socket.id}`);
  socket.on("send-message", (message) => {
    console.log(message);

    // Broadcast the  recevied message to all the users
    io.emit("recevied-message", message);
  });

  // when user disconnected
  socket.on("disconect", () => {
    console.log(`user disconected`);
  });
});

server.listen(process.env.PORT, () => {
  console.log("server is running port 5000");
});
app.get("/", (req, res) => {
  res.json("Server is runnining bro chill !");
});
