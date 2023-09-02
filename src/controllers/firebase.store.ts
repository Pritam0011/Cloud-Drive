import { Request, Response } from "express";
import path from "path";
import multer from "multer";
import { File } from "../models/model";
import { firebaseConfig, serviceAccount } from "../config/firebase.config";
import { initializeApp, getApp } from "firebase/app";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import admin from "firebase-admin";

//fireadmin config
admin.initializeApp(
	{
		credential: admin.credential.cert(<any>serviceAccount),
	},
	"admin"
);

// Initialize Firebase
initializeApp(firebaseConfig, "storage");

//Initialize cloud storage and get a reference to the service
const storage = getStorage(getApp("storage"));

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 52428800 },
}).single("efile");

const up = async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");

	try {
		upload(req, res, async (e) => {
			if (!req.file)
				return res.status(400).json({ message: `All Field are required.` });
			if (e)
				return res.status(400).json({ message: `Upload Error: ${e.message}` });

			const decodedToken = await admin.auth().verifyIdToken(authToken);
			const uid = decodedToken.uid;

			const firename = `${path.basename(
				req.file.originalname,
				path.extname(req.file.originalname)
			)}_${Date.now()}_${Math.random() * 100000 + 1}${path.extname(
				req.file.originalname
			)}`;
			const storageRef = ref(storage, `uploads/${firename}`);
			const metadata = {
				contentType: req.file.mimetype,
			};
			/* `creating a task to upload the file to the Firebase Cloud Storage. */
			const uploadTask = await uploadBytesResumable(
				storageRef,
				req.file.buffer,
				metadata
			);

			const downloadUrl = await getDownloadURL(uploadTask.ref);
			const file_size = req.file.size;
			const file = new File({
				uid,
				name: req.file.originalname,
				firebasename: firename,
				type: req.file.mimetype,
				size:
					file_size >= 1048576
						? `${(file_size / 1048576).toFixed(2)} MB`
						: `${(file_size / 1024).toFixed(2)} KB`,
				url: downloadUrl,
				created: uploadTask.metadata.timeCreated,
				firebaselocation: `gs://drive-9ef3a.appspot.com/uploads/${firename}`,
			});

			await file.save();

			return res.status(200).json({ message: "Upload Done." });
		});
	} catch (e: any) {
		return res.status(400).json({ message: e.message });
	}
};

export default up;
