const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("In storage - destination");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log("In storage - filename");
    console.log("file is : ", file);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    console.log("In if - fileFilter");
    cb(new Error("Please upload an image file"), false);
  } else {
    console.log("In else - fileFilter");
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
