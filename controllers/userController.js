const { readJSON } = require("../utils/fileHandler");

exports.findUser = async (req, res) => {
  try {
    const query = req.query.q;
    const currUser = req.user?.sub;

    if (!query) {
      return res.json([]);
    }

    const data = await readJSON("./data/credentials.json");

    const users = data
      .filter(
        (user) =>
          user.username.toLowerCase().startsWith(query.toLowerCase()) &&
          user.username !== currUser,
      )
      .map(({ password, ...rest }) => rest);

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};
