const con = require("../database/dbConnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const employeeLogin = async (req, res) => {
  try {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], async (err, result) => {
      if (err) {
        console.error("Database query failed:", err);
        return res
          .status(500)
          .json({ loginStatus: false, Error: "Internal Server Error" });
      }
      if (result.length > 0) {
        const response = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (response) {
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true, id: result[0].id });
        } else {
          return res
            .status(401)
            .json({ loginStatus: false, Error: "Wrong Password" });
        }
      } else {
        return res
          .status(404)
          .json({ loginStatus: false, Error: "Wrong email or password" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ loginStatus: false, Error: "An unexpected error occurred" });
  }
};

const employeeDetailById = (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";

    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Database query failed:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Internal Server Error" });
      }

      if (result.length > 0) {
        return res.json({ Status: true, Result: result });
      } else {
        return res
          .status(404)
          .json({ Status: false, Error: "Employee not found" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ Status: false, Error: "An unexpected error occurred" });
  }
};

const employeeLogout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ Status: true });
  } catch (error) {
    return res
      .status(500)
      .json({ Status: false, Error: "An unexpected error occurred" });
  }
};

module.exports = {
  employeeLogin,
  employeeDetailById,
  employeeLogout,
};
