import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import cors from "cors";
import { corsOptions } from "./corsOptions.js";


const app = express();

app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

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

export default app ;
