import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import ejslayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import db from "./config/database.config";
const app: Express = express();
const port = process.env.PORT;
import rou from "./routes/router";
import path from "path";
import cors from "cors";

app.listen(port, () => {
	const now = new Date();
	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: true, // 12-hour time format
	};

	const date = now.toLocaleTimeString("en-US", options);
	console.log(
		`[${date}] Server started at port ${port} URL: http://localhost:${port}`
	);
});

// database connection
db();

const corsOptions = {
	origin: "*",
	methods: "GET,PUT,POST,DELETE",
	allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));

app.set("views", "static/pages");
app.set("view engine", "ejs");
app.use(ejslayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../static")));
app.use(cookieParser());

app.use("/", rou);
