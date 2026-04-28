//controllers/messageController.js

const { readJSON, writeJSON } = require("../utils/fileHandler");

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
      id: messageDB.length ? messageDB.at(-1).id + 1 : 1,
      sender: req.body.currUser,
      receiver: req.body.selectedUser,
      messageContent: req.body.message?.toString() || "",
      time: Date.now(),
    };

    if (!newMessage.sender || !newMessage.receiver) {
      return res
        .status(400)
        .json({ success: false, note: "Sender and receiver name needed" });
    }

    if (!newMessage.messageContent) {
      return res.status(400).json({ success: false, note: "Empty message" });
    }

    messageDB.push(newMessage);

    await writeJSON("./data/messagesDB.json", messageDB);

    res.json({ success: true, note: "Message stored" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, note: "Something went wrong" });
  }
};
