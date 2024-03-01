const express = require("express");
const app = express();
require("dotenv").config();
const authRoute = require("./routes/authRoute");
const jobsRoute = require("./routes/jobsRoute");
const connectinoDB = require("./db/connectDB");
const authChecker = require("./middleware/authMiddleware");

//security packages
const cors = require("cors");
// const helmet = require("helmet");
// const xss = require("xss-clean");
// const rateLimiter = require("express-rate-limit");

// app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, //maximum 100 request per windowMS
//   })
// );
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// app.use(helmet());
// app.use(xss());

//json body parser
app.use(express.json());

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authChecker, jobsRoute);

//starting the server
const start = async () => {
  try {
    await connectinoDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`server is lisning on port ${process.env.PORT}`);
    });
  } catch (error) {}
};
//invoked imediately after running the dev environment
start();
