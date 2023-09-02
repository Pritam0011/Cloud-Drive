import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { firebaseConfig } from "../config/firebase.config";
import { Request, Response } from "express";
import { User } from "../models/model";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signin = (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(400)
			.render("authpage", { message: "All fields are required." });
	}

	signInWithEmailAndPassword(auth, email, password)
		.then(async (data) => {
			return data.user.getIdToken(true);
		})
		.then(async (token) => {
			const expirationDate = new Date();
			expirationDate.setTime(expirationDate.getTime() + 1 * 60 * 60 * 1000); // 6 hours in milliseconds
			const expiresUTC = expirationDate.toUTCString();

			res.cookie("authToken", token, {
				expires: new Date(expiresUTC),
				httpOnly: true,
			});
			return res.status(200).redirect("/welcome");
		})
		.catch((e) => {
			return res.status(400).render("authpage", { message: e.message });
		});
};
const signup = (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res
			.status(400)
			.render("authpage", { message: "All fields are required." });
	}
	createUserWithEmailAndPassword(auth, email, password)
		.then(async (data) => {
			// database
			const user = new User({
				uid: data.user.uid,
				name: name,
				email: email,
				password: password,
			});
			await user.save();
			return data.user.getIdToken(true);
		})
		.then((token) => {
			//cookies
			const expirationDate = new Date();
			expirationDate.setTime(expirationDate.getTime() + 1 * 60 * 60 * 1000); // 6 hours in milliseconds
			const expiresUTC = expirationDate.toUTCString();

			res.cookie("authToken", token, {
				expires: new Date(expiresUTC),
				httpOnly: true,
			});
			return res.status(200).redirect("/welcome");
		})
		.catch((e) => {
			return res.status(400).render("authpage", { message: e.message });
		});
};

const signout = (req: Request, res: Response) => {
	try {
		signOut(auth);
		res.clearCookie("authToken");
		return res.status(200).redirect("/");
	} catch (e: any) {
		return res.status(400).redirect("/");
	}
};
export { auth, signin, signup, signout };
