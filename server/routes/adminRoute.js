const express = require("express");
const { register } = require("../controllers/adminController");

const router = express.Router();

router.post("/adminRegister", register);

module.exports = router;
