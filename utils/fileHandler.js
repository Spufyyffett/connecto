//utils/fileHandler.js

const fs = require("fs").promises;

exports.readJSON = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

exports.writeJSON = async (file, data) => {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
};
