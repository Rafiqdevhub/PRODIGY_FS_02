const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectionDb = require("../database/dbConnection");

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const checkUserSql = "SELECT * FROM users WHERE email = ?";
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
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
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

module.exports = { register };
