import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// imports all routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",") || [];

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("❌❌ Not allow by CORS."));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	})
);

app.get("/", (req, res) => {
	res.send("😊😊 Job board backend run successfully 😊😊");
});

// use all routes
app.use("/api/user", userRoute);
app.use("/api/application", applicationRoute);
app.use("/api/job", jobRoute);
app.use("/api/company", companyRoute);

export default app;
