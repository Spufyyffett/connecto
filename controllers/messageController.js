//controllers/messageController.js

const { readJSON, writeJSON } = require("../utils/fileHandler");
const { sendToUser } = require("../socketServer");

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.sub;

    const messages = await readJSON("./data/messagesDB.json");

    const filtered = messages.filter(
      (u) => u.sender === userId || u.receiver === userId,
    );

    filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
    res.json(filtered);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const messageDB = await readJSON("./data/messagesDB.json");
    const newMessage = {
      id: null,
      sender: null,
      receiver: null,
      messageContent: null,
      isFile: null,
      fileName: null,
      fileURL: null,
      fileSize: null,
      MIMEtype: null,
      time: null,
    };

    if (req.file) {
      newMessage.id = messageDB.length ? messageDB.at(-1).id + 1 : 1;
      newMessage.sender = req.body.currUser;
      newMessage.receiver = req.body.selectedUser;
      newMessage.messageContent = req.body.message || "";
      newMessage.isFile = true;
      newMessage.fileName = req.file.originalname;
      newMessage.fileURL = `/uploads/${req.file.filename}`;
      newMessage.fileSize = req.file.size;
      newMessage.MIMEtype = req.file.mimetype;
      newMessage.time = Date.now();
    } else {
      newMessage.id = messageDB.length ? messageDB.at(-1).id + 1 : 1;
      newMessage.sender = req.body.currUser;
      newMessage.receiver = req.body.selectedUser;
      newMessage.messageContent = req.body.message || "";
      newMessage.isFile = false;
      newMessage.fileName = null;
      newMessage.fileURL = null;
      newMessage.fileSize = null;
      newMessage.MIMEtype = null;
      newMessage.time = Date.now();
    }

    if (!newMessage.sender || !newMessage.receiver) {
      return res
        .status(400)
        .json({ success: false, note: "Sender and receiver name needed" });
    }

    if (!newMessage.messageContent && newMessage.isFile === false) {
      return res.status(400).json({ success: false, note: "Empty message" });
    }

    messageDB.push(newMessage);

    await writeJSON("./data/messagesDB.json", messageDB);

    res.json({ success: true, note: "Message stored", info: newMessage });

    sendToUser(req.body.selectedUser, "liveChat", newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, note: "Something went wrong" });
  }
};
