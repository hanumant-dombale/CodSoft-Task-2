const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");

export const corsOrigins = (origin, callback) => {
	if (!origin) return callback(null, true);

	if (allowedOrigins.includes(origin)) {
		callback(null, true);
	} else {
		callback(new Error("Not allow by CORS."));
	}
};
