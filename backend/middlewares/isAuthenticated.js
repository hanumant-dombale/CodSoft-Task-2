import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({
				message: "User not authenticated",
				success: false,
			});
		}

		const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

		if (!decode) {
			return res.status(401).json({
				message: "Invalid token",
				success: false,
			});
		}

		req.id = decode.userId;
		next();
	} catch (error) {
		console.log("Authentication Error: ", error);
		return res.status(401).json({
			message: "Invalid token or Expired token",
			success: false,
		});
	}
};

export default isAuthenticated;
