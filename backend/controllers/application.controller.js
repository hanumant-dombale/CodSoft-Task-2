import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
	try {
		const userId = req.id;
		const jobId = req.params.id;
		if (!jobId) {
			return res.status(400).json({
				message: "Job id is required.",
				success: false,
			});
		}

		const existingApplication = await Application.findOne({
			job: jobId,
			applicant: userId,
		});

		if (existingApplication) {
			return res.status(400).json({
				message: "You have already applied for this jobs",
				success: false,
			});
		}

		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({
				message: "Job not found",
				success: false,
			});
		}

		const newApplication = await Application.create({
			job: jobId,
			applicant: userId,
		});

		job.applications.push(newApplication._id);
		await job.save();
		return res.status(201).json({
			message: "Job applied successfully.",
			success: true,
		});
	} catch (error) {
		console.log("Applying Job Error: ", error);
		return res.status(500).json({
			message: "Internal server error while applying job.",
			success: false,
			error: error,
		});
	}
};

export const getAppliedJobs = async (req, res) => {
	try {
		const userId = req.id;
		const application = await Application.find({
			applicant: userId,
		})
			.sort({ createdAt: -1 })
			.populate({
				path: "job",
				options: { sort: { createdAt: -1 } },
				populate: {
					path: "company",
					options: { sort: { createdAt: -1 } },
				},
			});
		if (!application) {
			return res.status(404).json({
				message: "No Applications",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Get all jobs successfully.",
			application,
			success: true,
		});
	} catch (error) {
		console.log("Get All Jobs Error: ", error);
		return res.status(500).json({
			message: "Internal server error while getting all jobs.",
			success: false,
			error: error,
		});
	}
};

export const getApplicants = async (req, res) => {
	try {
		const jobId = req.params.id;
		const job = await Job.findById(jobId).populate({
			path: "applications",
			options: { sort: { createdAt: -1 } },
			populate: {
				path: "applicant",
			},
		});
		if (!job) {
			return res.status(404).json({
				message: "Job not found.",
				success: false,
			});
		}
		return res.status(200).json({
			message: "Get all applicants successfully.",
			job,
			succees: true,
		});
	} catch (error) {
		console.log("Get All Applicants Error: ", error);
		return res.status(500).json({
			message: "Internal server error while gettinf all applicants.",
			success: false,
			error: error,
		});
	}
};

export const updateStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const applicationId = req.params.id;
		if (!status) {
			return res.status(400).json({
				message: "status is required",
				success: false,
			});
		}

		const application = await Application.findOne({
			_id: applicationId,
		});
		if (!application) {
			return res.status(404).json({
				message: "Application not found.",
				success: false,
			});
		}

		application.status = status.toLowerCase();
		await application.save();

		return res.status(200).json({
			message: "Status updated successfully.",
			success: true,
		});
	} catch (error) {
		console.log("Update Status Error: ", error);
		return res.status(500).json({
			message: "Internal server error while updating status.",
			success: false,
			error: error,
		});
	}
};
