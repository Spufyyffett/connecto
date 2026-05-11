const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const supportedMIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
];

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 40 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    console.log(file.mimetype);
    if (supportedMIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(
        new Error("Only png, jpg, jpeg, pdf and zip files are allowed"),
      );
    }
  },
});

module.exports = upload;
