import { useState } from "react";
import "../style/style.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:3000/auth/admin/register",
        values
      );
      if (result.data.registerStatus) {
        setSuccess("User registered successfully!");
        setError(null);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.data.Error);
        setSuccess(null);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again later.");
      setSuccess(null);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 signupPage">
      <div className="p-3 rounded w-25 border signupForm">
        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-success">{success}</div>}
        <h2>Signup Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username:</strong>
            </label>
            <input
              type="text"
              name="username"
              autoComplete="off"
              placeholder="Enter Username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-primary w-100 rounded-0 mb-2">
            Sign up
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="tick">You agree with terms & conditions</label>
          </div>
        </form>
        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
