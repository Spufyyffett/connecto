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
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "image/x-icon",
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/matroska",
  "audio/aac",
  "audio/webm",
  "audio/mpeg",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/vnd.dlna.adts",
  "text/plain",
  "text/csv",
  "text/css",
  "text/html",
  "text/xml",
  "text/javascript",
  "text/markdown",
  "application/vnd.rar",
  "application/x-compressed",
  "application/x-7z-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/xml",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/json",
  "application/octet-stream",
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
        new Error(`Uploaded file type ${file.mimetype} is not supported`),
      );
    }
  },
});

module.exports = upload;
