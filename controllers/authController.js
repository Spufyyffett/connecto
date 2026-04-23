//controllers/authContoller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readJSON, writeJSON } = require("../utils/fileHandler");

exports.login = async (req, res) => {
  try {
    const loginCred = await readJSON("./data/credentials.json");

    const user = loginCred.find(
      (u) => u.username === req.body.username?.trim(),
    );

    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password?.trim(),
      user.password,
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { sub: user.username, iat: Date.now() },
      process.env.JWT_SEC_KEY,
      { expiresIn: "12h" },
    );

    res.json({ message: "Login Successfull", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

exports.register = async (req, res) => {
  try {
    const loginCred = await readJSON("./data/credentials.json");

    const exists = loginCred.find(
      (u) => u.username === req.body.username?.trim(),
    );
    if (exists) {
      return res.status(409).json({ message: "Username taken" });
    }

    const newUser = {
      username: req.body.username?.trim(),
      password: await bcrypt.hash(req.body.password?.trim(), 10),
    };

    if (!newUser.username || !newUser.password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    loginCred.push(newUser);
    await writeJSON("./data/credentials.json", loginCred);

    const token = jwt.sign(
      { sub: newUser.username, iat: Date.now() },
      process.env.JWT_SEC_KEY,
      { expiresIn: "12h" },
    );

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
