const express = require("express");
const app = express();
const router = express.Router();
const {
  getAllJobs,
  getJobs,
  createJobs,
  updateJobs,
  deleteJobs,
  showStats,
} = require("../controller/jobsController");

router.route("/stats").get(showStats);
router.route("/").get(getAllJobs).post(createJobs);
router.route("/:id").get(getJobs).patch(updateJobs).delete(deleteJobs);

module.exports = router;
