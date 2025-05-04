import React, { useState, useEffect } from "react";
import "./style/Message.css";
import useAxios from "../utils/useAxios";
import { Link, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

function SearchUsers() {
  const baseURL = "http://127.0.0.1:8000/api";
  const [users, setUsers] = useState([]);
  const [newSearch, setNewSearch] = useState({ search: "" });
  const axios = useAxios();

  const { username } = useParams();
  const navigate = useNavigate(); // Replaces useHistory

  // Fetch users based on the URL parameter
  useEffect(() => {
    if (username) {
      axios
        .get(`${baseURL}/search/${username}/`)
        .then((res) => setUsers(res.data))
        .catch(() => showErrorAlert("User Does Not Exist"));
    }
  }, [username]);

  const showErrorAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 2000,
      position: "middle",
      timerProgressBar: true,
      showConfirmButton: false,
      showCancelButton: true,
    });
  };

  // Update search input state
  const handleSearchChange = (event) => {
    setNewSearch({ search: event.target.value });
  };

  // Perform user search
  const searchUser = () => {
    if (!newSearch.search.trim()) {
      showErrorAlert("Please enter a username to search!");
      return;
    }

    axios
      .get(`${baseURL}/search/${newSearch.search}/`)
      .then((res) => {
        navigate(`/search/${newSearch.search}/`);
        setUsers(res.data);
      })
      .catch(() => showErrorAlert("User Does Not Exist"));
  };

  return (
    <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
                <div className="px-4">
                  <div className="d-flex align-items-center mt-2">
                    <input
                      type="text"
                      className="form-control my-3"
                      placeholder="Search..."
                      value={newSearch.search}
                      onChange={handleSearchChange}
                      name="search"
                    />
                    <button
                      className="ml-2"
                      onClick={searchUser}
                      style={{ border: "none", borderRadius: "50%" }}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>

                {/* User List */}
                {users.length > 0 ? (
                  users.map((user) => (
                    <Link
                      key={user.id} // Added key prop
                      to={`/inbox/${user.id}`}
                      className="list-group-item list-group-item-action border-0"
                    >
                      <div className="d-flex align-items-start">
                        <img
                          src={user.image}
                          className="rounded-circle mr-1"
                          alt="Profile"
                          width={40}
                          height={40}
                        />
                        <div className="flex-grow-1 ml-3">
                          {user.full_name}
                          <div className="small">
                            <small>
                              <i className="fas fa-envelope"> Send Message</i>
                            </small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted">No users found</p>
                )}

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchUsers;
