import multer from "multer";
import path from "path";
import fs from "fs";

let uploadDir = path.join(process.cwd(), "public");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export let upload = multer({ storage })
