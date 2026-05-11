const { initSocket } = require("./socketServer");

const express = require("express");
const http = require("http");
require("dotenv").config();
// const path = require("path");

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("data/uploads"));
app.get("/", (req, res) => {
  res.redirect("/auth");
});

const PORT = 5500;
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/messages", messageRoutes);
app.use("/auth", authRoutes);
app.use("/search", userRoutes);

server.listen(PORT, (req, res) => {
  console.log("Server listening at Port ", PORT);
});
