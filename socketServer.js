const { Server } = require("socket.io");
const { authMiddlewareSocket } = require("./middleware/authMiddleware");

const userSocketMap = new Map();
let io;

exports.initSocket = (server) => {
  io = new Server(server);

  io.use(authMiddlewareSocket);

  io.on("connection", (socket) => {
    const userId = socket.username;
    userSocketMap.set(userId, socket.id);

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });
};

exports.sendToUser = (username, event, data) => {
  const socketId = userSocketMap.get(username);

  if (socketId && io) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false;
};
