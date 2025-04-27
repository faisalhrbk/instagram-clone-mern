import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({
				message: "User not Authenticated",
				success: false,
			});
		}
		const decode = await jwt.verify(token, process.env.SECRET_KEY);
		if (!decode) {
			return res.status(401).json({
				message: "Invalid Token",
				success: false,
			});
		}
		req.id = decode.userId;
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "internal server error",
			success: false,
		});
	}
};
