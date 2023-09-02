import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		uid: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const fileSchema = new Schema(
	{
		uid: { type: String, required: true },
		name: { type: String, required: true },
		firebasename: { type: String, required: true },
		type: { type: String, required: true },
		size: { type: String, required: true },
		url: { type: String, required: true },
		created: { type: String, required: true },
		firebaselocation: { type: String, required: true },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema, "users");
export const File = mongoose.model("File", fileSchema, "files");
