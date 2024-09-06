const express = require("express");

const router = express.Router();
const {
  employeeLogin,
  employeeDetailById,
  employeeLogout,
} = require("../controllers/employeeController");

router.post("/employeeLogin", employeeLogin);
router.post("/detail/:id", employeeDetailById);
router.post("/logout", employeeLogout);

module.exports = router;
