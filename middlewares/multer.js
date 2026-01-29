import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pathToSave = 'uploads/';
    const typeFile = file.mimetype.split('/')[0];
    if (typeFile === 'image') cb(null, `${pathToSave}pets/`);
    else cb(null, `${pathToSave}documents/`);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

export const upload = multer({ storage });