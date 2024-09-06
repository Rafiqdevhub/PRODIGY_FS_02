const express = require("express");
const {
  register,
  adminLogin,
  getCategory,
  addCategory,
  addEmployee,
  getEmployees,
  getEmployeeById,
  editEmployeeById,
  deleteEmployeeById,
  getAdminCount,
  getEmployeeCount,
  getSalaryCount,
  getAdminRecords,
  logout,
} = require("../controllers/adminController");
const { upload } = require("../multer/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", adminLogin);
router.get("/category", getCategory);
router.post("/addCategory", addCategory);
router.post("/addEmployee", upload.single("image"), addEmployee);
router.get("/employee", getEmployees);
router.get("/employee/:id", getEmployeeById);
router.put("/editEmployee/:id", editEmployeeById);
router.delete("/deleteEmployee/:id", deleteEmployeeById);
router.get("/adminCount", getAdminCount);
router.get("/employeeCount", getEmployeeCount);
router.get("/salaryCount", getSalaryCount);
router.get("/adminRecord", getAdminRecords);
router.get("/logout", logout);
module.exports = router;
