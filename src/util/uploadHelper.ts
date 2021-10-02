import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    cb(null, `${file.fieldname}_${Date.now()}${fileExtension}`);
  },
});
const upload = multer({ storage });

export default upload;