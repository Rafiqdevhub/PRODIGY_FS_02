const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const adminRoute = require("./routes/adminRoute");
const EmployeeRouter = require("./routes/employeeRoute");
const verifyUser = require("./middleware/verify");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

app.use("/auth/admin", adminRoute);
app.use("/employee", EmployeeRouter);

app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
