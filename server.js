const express = require("express");
const app = express();

app.use(express.json());

require("dotenv").config();

app.use(express.static("public"));

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

app.listen(PORT, (req, res) => {
  console.log("Server listening at Port ", PORT);
});
