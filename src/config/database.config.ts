import mongoose from "mongoose";
const dburl = <string>process.env.DBURL;

const db = () => {
	try {
		mongoose.connect(dburl);
		const dbcon = mongoose.connection;
		dbcon.once("open", () => {
			console.log("Connected to database.");
		});
	} catch (e: any) {
		console.log(e.message);
	}
};

export default db;
