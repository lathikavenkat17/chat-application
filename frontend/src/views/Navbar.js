import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // ✅ Correct import

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);  // Get user from AuthContext
  const token = localStorage.getItem("authTokens");

  let user_id = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);  // ✅ Use jwtDecode instead of jwt_decode
      user_id = decoded.user_id;
    } catch (error) {
      console.error("Invalid Token:", error);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            style={{ width: "60px", padding: "6px" }}
            src="chatlogo.png"
            alt="Logo"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                <i className="fas fa-home"></i> Home
              </Link>
            </li>

            {!user ? ( // Check user instead of token
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fas fa-user-plus"></i> Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/inbox">
                    <i className="fas fa-envelope"></i> chats
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={logoutUser}
                    style={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
