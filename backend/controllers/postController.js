import sharp from "sharp";
export const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const image = req.file;
		const authorId = req.id;
		if (!image) {
			return res.status(401).json({
				message: "image Required",
				success: false,
			});
		}
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({
				width: 800,
				height: 800,
				fit: "inside",
			})
			.toFormat("jpeg", { quality: "80" })
			.toBuffer();
             
	} catch (err) {
		return res.status(500).json({
			message: "Internal Server Error",
			success: false,
		});
	}
};
