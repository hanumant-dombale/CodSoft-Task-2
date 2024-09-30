import { connect } from "mongoose";

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch (err) {
        console.log(err);
    }
};
export default connectDB;
