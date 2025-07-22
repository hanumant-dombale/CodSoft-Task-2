import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import cors from "cors";
import { corsOptions } from "./corsOptions.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
	res.send("Job board backend run successfully");
});

app.use((req, res, next) => {
	console.log(`Backend hit: ${req.method} ${req.url}`);
	next();
});

app.use("/api/user", userRoute);
app.use("/api/application", applicationRoute);
app.use("/api/job", jobRoute);
app.use("/api/company", companyRoute);

app.listen(PORT, () => {
	connectDB();
	console.log(`Server running at port ${PORT}`);
});
