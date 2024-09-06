const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectionDb = require("../database/dbConnection");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const checkUserSql = "SELECT * FROM usersregister WHERE email = ?";
    connectionDb.query(checkUserSql, [email], async (err, result) => {
      if (err) {
        console.error("Database query failed:", err);
        return res
          .status(500)
          .json({ registerStatus: false, Error: "Internal Server Error" });
      }

      if (result.length > 0) {
        return res
          .status(400)
          .json({ registerStatus: false, Error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO usersregister (username, email, password) VALUES (?, ?, ?)";
      connectionDb.query(
        sql,
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Database insertion failed:", err);
            return res
              .status(500)
              .json({ registerStatus: false, Error: "Internal Server Error" });
          }
          const token = jwt.sign(
            { role: "user", email: email, id: result.insertId },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          return res.status(201).json({
            registerStatus: true,
            message: "User registered successfully",
          });
        }
      );
    });
  } catch (error) {
    console.error("Registration process failed:", error);
    return res
      .status(500)
      .json({ registerStatus: false, Error: "Internal Server Error" });
  }
};

const adminLogin = (req, res) => {
  try {
    const sql = "SELECT * FROM usersregister WHERE email = ?";
    connectionDb.query(sql, [req.body.email], async (err, result) => {
      if (err) {
        console.error("Database query failed:", err);
        return res
          .status(500)
          .json({ loginStatus: false, Error: "Internal Server Error" });
      }

      if (result.length > 0) {
        const hashedPassword = result[0].password;
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          hashedPassword
        );

        if (passwordMatch) {
          const email = result[0].email;
          const username = result[0].username; // Get the admin's username
          const token = jwt.sign(
            { role: "admin", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );

          // Set the token as a cookie
          res.cookie("token", token, {
            httpOnly: true,
          });

          // Send the admin's name and email in the response
          return res.status(200).json({
            loginStatus: true,
            admin: {
              name: username,
              email: email,
            },
          });
        } else {
          return res.status(401).json({
            loginStatus: false,
            Error: "Incorrect email or password",
          });
        }
      } else {
        return res.status(401).json({
          loginStatus: false,
          Error: "Incorrect email or password",
        });
      }
    });
  } catch (error) {
    console.error("Login process failed:", error);
    return res
      .status(500)
      .json({ loginStatus: false, Error: "Internal Server Error" });
  }
};

const getCategory = (req, res) => {
  const sql = "SELECT * FROM category";

  // Execute the query to fetch categories
  connectionDb.query(sql, (err, result) => {
    if (err) {
      // Log the error for debugging purposes
      console.error("Failed to fetch categories:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    // Successfully fetched categories
    return res.status(200).json({ Status: true, Result: result });
  });
};

// Function to add a new category
const addCategory = (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";

  // Execute the query to insert a new category
  connectionDb.query(sql, [req.body.category], (err, result) => {
    if (err) {
      // Log the error for debugging purposes
      console.error("Failed to add category:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    // Successfully added category
    return res.status(201).json({ Status: true });
  });
};

// Function to add a new employee
const addEmployee = (req, res) => {
  const sql = `INSERT INTO employee 
    (name,email,password,address,salary,image,category_id) 
    VALUES (?)`;

  // Hash the employee's password before saving it
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      // Log the error for debugging purposes
      console.error("Password hashing failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }

    // Prepare the values for the new employee record
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];

    // Execute the query to insert the new employee
    connectionDb.query(sql, [values], (err, result) => {
      if (err) {
        // Log the error for debugging purposes
        console.error("Failed to add employee:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Internal Server Error" });
      }
      // Successfully added employee
      return res.status(201).json({ Status: true });
    });
  });
};

// Function to get all employees
const getEmployees = (req, res) => {
  const sql = "SELECT * FROM employee";

  // Execute the query to fetch all employees
  connectionDb.query(sql, (err, result) => {
    if (err) {
      // Log the error for debugging purposes
      console.error("Failed to fetch employees:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    // Successfully fetched employees
    return res.status(200).json({ Status: true, Result: result });
  });
};

const getEmployeeById = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  connectionDb.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const editEmployeeById = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE employee 
      SET name = ?, email = ?, salary = ?, address = ?, category_id = ? 
      WHERE id = ?`;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
  ];
  connectionDb.query(sql, [...values, id], (err, result) => {
    if (err) {
      console.error("Database update failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const deleteEmployeeById = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  connectionDb.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database delete failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
    }
    return res
      .status(200)
      .json({ Status: true, Result: "Employee deleted successfully" });
  });
};

const getAdminCount = (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM usersregister";
  connectionDb.query(sql, (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const getEmployeeCount = (req, res) => {
  const sql = "SELECT COUNT(id) AS employee FROM employee";
  connectionDb.query(sql, (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const getSalaryCount = (req, res) => {
  const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
  connectionDb.query(sql, (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const getAdminRecords = (req, res) => {
  const sql = "SELECT * FROM usersregister";
  connectionDb.query(sql, (err, result) => {
    if (err) {
      console.error("Database query failed:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal Server Error" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ Status: true });
  } catch (err) {
    console.error("Failed to clear cookies:", err);
    return res
      .status(500)
      .json({ Status: false, Error: "Internal Server Error" });
  }
};

module.exports = {
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
};
