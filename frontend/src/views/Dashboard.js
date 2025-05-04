import { useState, useEffect } from "react";
import useAxios from "../utils/useAxios";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [res, setRes] = useState("");
  const api = useAxios();

  const token = localStorage.getItem("authTokens");
  let user_id, username, full_name, image;

  if (token) {
    const decodedToken = jwtDecode(JSON.parse(token).access);
    user_id = decodedToken.user_id;
    username = decodedToken.username;
    full_name = decodedToken.full_name;
    image = decodedToken.image;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/test/");
        setRes(response.data.response);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRes("Something went wrong");
      }
    };
    fetchData();
  }, [api]); // Include `api` in dependencies

  return (
    <div>
      <div className="container-fluid" style={{ paddingTop: "100px" }}>
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar mt-4">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Dashboard <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Orders</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Products</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Customers</a>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
              <h1 className="h2">My Dashboard</h1>
              <span>Hello {username}!</span>
            </div>
            <div className="alert alert-success">
              <strong>{res}</strong>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
