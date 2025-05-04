import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function LoginPage() {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email.length > 0) {
      loginUser(email, password);
    }
  };

  return (
    <section className="vh-100 bg-secondary">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                {/* Left Image Section */}
                <div className="col-md-6 d-none d-md-block">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                    alt="Login"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>

                {/* Right Form Section */}
                <div className="col-md-6 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4 text-center">
                        <h2 className="fw-bold">Welcome back 👋</h2>
                        <p className="text-muted">Sign into your account</p>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Email address</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          name="email"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          name="password"
                          required
                        />
                      </div>

                      <button className="btn btn-primary btn-lg w-100" type="submit">
                        Login
                      </button>

                      <div className="mt-3 text-center">
                        <Link to="/forgot-password" className="small text-muted">
                          Forgot password?
                        </Link>
                      </div>

                      <p className="mt-4 text-center">
                        Don't have an account?{" "}
                        <Link to="/register" className="fw-bold">
                          Register Now
                        </Link>
                      </p>

                      <div className="text-center mt-3">
                        <Link to="/terms" className="small text-muted me-2">
                          Terms of use
                        </Link>
                        <Link to="/privacy" className="small text-muted">
                          Privacy policy
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-4">
              <p className="text-muted small">
                © {new Date().getFullYear()} desphixs.com
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
