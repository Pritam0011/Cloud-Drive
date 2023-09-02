import express, { Request, Response, Router } from "express";
const rou: Router = express.Router();
import upload from "../controllers/firebase.store";
import { signin, signup, signout } from "../controllers/firebase.auth";
import path from "path";
import { User, File } from "../models/model";
import admin from "firebase-admin";

import { serviceAccount } from "../config/firebase.config";

//fireadmin config
admin.initializeApp({
	credential: admin.credential.cert(<any>serviceAccount),
	storageBucket: "gs://drive-9ef3a.appspot.com",
});

const bucket = admin.storage().bucket();

//get methods
rou.get("/", (req: Request, res: Response) => {
	return res.status(200).render("index");
});
rou.get("/authpage", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).render("authpage");
	else return res.status(200).redirect("/welcome");
});
rou.get("/js/authpage.js", (req: Request, res: Response) => {
	const filePath = path.join(__dirname, "../client/authpage.js");
	return res.status(200).sendFile(filePath);
});
rou.get("/js/upload.js", (req: Request, res: Response) => {
	const filePath = path.join(__dirname, "../client/upload.js");
	return res.status(200).sendFile(filePath);
});

rou.get("/welcome", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");
	try {
		const decodedToken = await admin.auth().verifyIdToken(authToken);
		const uid = decodedToken.uid;
		const user = await User.findOne({ uid });
		if (user === null) {
			res.clearCookie("authToken");
			return res.status(401).redirect("/authpage");
		}
		return res.status(200).render("welcome", { ename: user.name });
	} catch (e: any) {
		return res.status(401).redirect("/authpage");
	}
});

rou.get("/welcome/upload", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");
	try {
		const decodedToken = await admin.auth().verifyIdToken(authToken);
		const uid = decodedToken.uid;
		const user = await User.findOne({ uid });
		if (user === null) {
			res.clearCookie("authToken");
			return res.status(401).redirect("/authpage");
		}
		return res.status(200).render("upload", { uname: user.name });
	} catch (e: any) {
		return res.status(400).redirect("/welcome");
	}
});
rou.get("/welcome/view", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");
	try {
		const decodedToken = await admin.auth().verifyIdToken(authToken);
		const uid = decodedToken.uid;
		const user = await User.findOne({ uid });
		if (user === null) {
			res.clearCookie("authToken");
			return res.status(401).redirect("/authpage");
		}
		const files = await File.find({ uid });

		if (files.length === 0)
			return res.status(200).render("view", { data: null });
		return res.status(200).render("view", { data: files });
	} catch (e: any) {
		return res.status(400).redirect("/welcome");
	}
});
rou.get("/welcome/view/details/:id", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");
	try {
		const decodedToken = await admin.auth().verifyIdToken(authToken);
		const uid = decodedToken.uid;
		const user = await User.findOne({ uid });
		if (user === null) {
			res.clearCookie("authToken");
			return res.status(401).redirect("/authpage");
		}
		const file = await File.findOne({ _id: req.params.id });

		if (file === null) return res.status(404).redirect("/welcome/view");

		return res
			.status(200)
			.render("viewDetails", { data: file, _id: req.params.id });
	} catch (e: any) {
		return res.status(400).redirect("/welcome/view");
	}
});
rou.get("/welcome/view/delete/:id", async (req: Request, res: Response) => {
	const authToken = req.cookies.authToken;
	if (!authToken) return res.status(401).redirect("/authpage");
	try {
		const decodedToken = await admin.auth().verifyIdToken(authToken);
		const uid = decodedToken.uid;
		const user = await User.findOne({ uid });
		if (user === null) {
			res.clearCookie("authToken");
			return res.status(401).redirect("/authpage");
		}
		const file = await File.findOne({ _id: req.params.id });

		if (file === null) return res.status(404).redirect("/welcome/view");

		const filePath = `uploads/${file.firebasename}`;
		await bucket.file(filePath).delete();
		await File.deleteOne({ _id: req.params.id });
		let mess = encodeURIComponent(`${file.name} deleted successfully.`);
		return res.status(200).redirect(`/welcome/view?message=${mess}`);
	} catch (e: any) {
		return res.status(400).redirect("/welcome/view");
	}
});

rou.get("*", (req: Request, res: Response) => {
	return res.status(404).render("errorpage");
});

//post methods
rou.post("/send", upload);
rou.post("/signin", signin);
rou.post("/signup", signup);
rou.post("/signout", signout);

export default rou;
