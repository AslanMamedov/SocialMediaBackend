import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import fs from 'fs';

// const __filename = fileURLToPath(import.meta.url);
// const folderPath = path.parse(path.dirname(__filename)).dir + '\\uploads';



const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		cb(null, `${nanoid()}--${file.originalname}`);
	},
});

const type = ['image/jpg', 'image/png', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
	if (type.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({ storage, fileFilter });

export default upload;
