import { connect } from "mongoose";

const connectDB = async () => {
	try {
		await connect(process.env.MONGODB_URI);
		console.log("🚀🚀 Mongodb Connected Successfully 🚀🚀");
	} catch (error) {
		console.log("❌❌ Database Connetion Error: ", error);
		process.exit(1);
	}
};

export default connectDB;
