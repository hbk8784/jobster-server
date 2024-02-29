const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide company name"],
    },
    position: {
      type: String,
      required: [true, "please provide position"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "please provide the user"],
    },
    jobLocation: {
      type: String,
      required: [true, "please provide job location"],
    },
    jobType: {
      type: String,
      required: [true, "please provide jobType"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", jobSchema);
