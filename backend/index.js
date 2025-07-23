import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import app from "./app.js";

dotenv.config({});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(
			`Server is running on this URI:  http://localhost:${PORT}`
		);
	});
});
