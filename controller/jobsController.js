const jobSchema = require("../model/jobSchema");
const moment = require("moment");
const mongoose = require("mongoose");

async function getAllJobs(req, res) {
  try {
    const { search, status, jobType, sort } = req.query;
    // console.log(req.query);

    const queryObject = {
      createdBy: req.user.id,
    };

    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }
    //////////////////////////////////////////////////////
    if (status && status !== "all") {
      queryObject.status = status;
    }
    if (jobType && jobType !== "all") {
      queryObject.jobType = jobType;
    }

    let jobs = await jobSchema.find(queryObject);

    // if (sort === "latest") {
    //   jobs = await jobs.sort("-createdAt");
    // } else if (sort === "oldest") {
    //   jobs = await jobs.sort("createdAt");
    // } else if (sort === "a-z") {
    //   jobs = await jobs.sort("position");
    // } else {
    //   jobs = await v.sort("-position");
    // }

    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;
    // const skip = (page - 1) * limit;

    // jobs = await jobs.skip(skip).limit(limit);

    // const totalJobs = await jobSchema.countDocuments(queryObject);
    // const numOfPages = Math.ceil(totalJobs / limit);

    // res.status(200).json({ jobs, totalJobs, numOfPages });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(400).json({ message: error.msg });
  }
}

const getJobs = async (req, res) => {
  const job = await jobSchema.findById(req.params.id);
  res.status(200).json({ job });
  if (!job) {
    res.status(400).json({ msg: "Job not Found" });
  }
};

const createJobs = async (req, res) => {
  req.body.createdBy = req.user.id;

  const job = await jobSchema.create({ ...req.body });
  res.status(200).json({ job });
  if (!job) {
    res.status(400).json({ msg: "Failed to create job" });
  }
};

const updateJobs = async (req, res) => {
  const job = await jobSchema.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ job });
  if (!job) {
    res.status(400).json({ msg: "Update Failed" });
  }
};

const deleteJobs = async (req, res) => {
  const job = await jobSchema.findByIdAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: "Removed job", job });
  if (!job) {
    res.status(400).json({ msg: "Cannot Delete Job" });
  }
};

const showStats = async (req, res) => {
  try {
    let stats = await jobSchema.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});
    const defaultStats = {
      pending: stats.panding || 0,
      interview: stats.interview || 0,
      declined: stats.declined || 0,
    };

    let monthlyApplications = await jobSchema.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    });

    res.status(200).json({ defaultStats, monthlyApplications });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  getAllJobs,
  getJobs,
  createJobs,
  updateJobs,
  deleteJobs,
  showStats,
};
