//Not used in this project
import multer from "multer";
import path from "path";

const store = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, "uploads");
	},
	filename(req, file, callback) {
		const n = `${path.basename(
			file.originalname,
			path.extname(file.originalname)
		)}_${Date.now()}_${Math.random() * 100000 + 1}${path.extname(
			file.originalname
		)}`;
		callback(null, n);
	},
});

const upload = multer({
	storage: store,
	limits: { fileSize: 52428800 },
}).single("efile"); //efile is name in html input tag

export { upload };
