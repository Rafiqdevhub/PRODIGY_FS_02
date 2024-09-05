const express = require("express");
const { register, adminLogin } = require("../controllers/adminController");

const router = express.Router();

router.post("/register", register);
router.post("/login", adminLogin);

module.exports = router;
