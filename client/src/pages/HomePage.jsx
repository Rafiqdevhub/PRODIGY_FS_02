import { Link } from "react-router-dom";
import "../style/style.css";

const HomePage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 homePage">
      <div className="text-center">
        <h1>Welcome to Employee Management System</h1>
        <p>Please choose an option below:</p>
        <div className="mt-4">
          <Link to="/signup">
            <button className="btn btn-primary mx-2">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary mx-2">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
