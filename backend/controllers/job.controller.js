import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
	try {
		const {
			title,
			description,
			requirements,
			salary,
			location,
			jobType,
			experience,
			position,
			companyId,
		} = req.body;
		const userId = req.id;

		if (
			!title ||
			!description ||
			!requirements ||
			!salary ||
			!location ||
			!jobType ||
			!experience ||
			!position ||
			!companyId
		) {
			return res.status(400).json({
				message: "All fields are required while creating job post.",
				success: false,
			});
		}

		const job = await Job.create({
			title,
			description,
			requirements: requirements.split(","),
			salary: salary,
			location,
			jobType,
			experienceLevel: experience,
			position,
			company: companyId,
			created_by: userId,
		});

		await job.save();

		return res.status(201).json({
			message: "New job created successfully.",
			job,
			success: true,
		});
	} catch (error) {
		console.log("Job Post Error: ", error);
		return res.status(500).json({
			message: "Internal server error while creating job post.",
			success: false,
			error: error,
		});
	}
};

export const getAllJobs = async (req, res) => {
	try {
		const keyword = req.query.keyword || "";
		const query = {
			$or: [
				{ title: { $regex: keyword, $options: "i" } },
				{
					description: {
						$regex: keyword,
						$options: "i",
					},
				},
			],
		};

		const jobs = await Job.find(query)
			.populate({
				path: "company",
			})
			.sort({ createdAt: -1 });
		if (!jobs) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "All jobs get successfully.",
			jobs,
			success: true,
		});
	} catch (error) {
		console.log("Get Jobs Error: ", error);
		return res.status(500).json({
			message: "Internal server error while getting all jobs.",
			success: false,
			error: error,
		});
	}
};

export const getJobById = async (req, res) => {
	try {
		const jobId = req.params.id;
		const job = await Job.findById(jobId).populate({
			path: "applications",
		});
		if (!job) {
			return res.status(404).json({
				message: "Job not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Job found successfully by this Id",
			job,
			success: true,
		});
	} catch (error) {
		console.log("Get Job by Id Error: ", error);
		return res.status(500).json({
			message: "Internal server error while getting job by Id.",
			success: false,
			error: error,
		});
	}
};

export const getAdminJobs = async (req, res) => {
	try {
		const adminId = req.id;
		const jobs = await Job.find({ created_by: adminId }).populate({
			path: "company",
			createdAt: -1,
		});

		if (!jobs) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Get all jobs by Admin.",
			jobs,
			success: true,
		});
	} catch (error) {
		console.log("Get Admin Jobs Error: ", error);
		return res.status(500).json({
			message: "Internal server error while getting admin jobs.",
			success: false,
			error: error,
		});
	}
};
