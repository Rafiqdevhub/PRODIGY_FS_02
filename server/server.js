const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const adminRoute = require("./routes/adminRoute");

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
