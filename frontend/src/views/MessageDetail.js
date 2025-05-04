import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import useAxios from '../utils/useAxios';
import './style/Message.css';
import { jwtDecode } from "jwt-decode";

function MessageDetail() {
  const baseURL = 'http://127.0.0.1:8000/api';
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [newMessage, setNewMessage] = useState({ message: "" });
  const [newSearch, setNewSearch] = useState({ search: "" });

  const axios = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const username = decoded.username;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${baseURL}/my-messages/${user_id}/`);
        setMessages(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [user_id, axios]);

  // Get all messages for a conversation
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${baseURL}/get-messages/${user_id}/${id}/`);
        setMessage(res.data);
      } catch (error) {
        console.error(error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user_id, id, axios]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}/profile/${id}/`);
        setProfile(res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [id, axios]);

  // Capture message input
  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value,
    });
  };

  // Send message
  const SendMessage = async () => {
    const formData = new FormData();
    formData.append("user", user_id);
    formData.append("sender", user_id);
    formData.append("reciever", id);
    formData.append("message", newMessage.message);
    formData.append("is_read", false);

    try {
      await axios.post(`${baseURL}/send-messages/`, formData);
      setNewMessage({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });
  };

  // Search for a user
  const SearchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/search/${newSearch.username}/`);
      navigate(`/search/${newSearch.username}/`);
    } catch (error) {
      alert("User does not exist");
    }
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
                      onChange={handleSearchChange}
                      name="username"
                    />
                    <button className="ml-2" onClick={SearchUser} style={{ border: "none", borderRadius: "50%" }}>
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>

                {messages.map((msg) => (
                  <Link
                    key={msg.id}
                    to={`/inbox-message/${msg.sender.id === user_id ? msg.reciever.id : msg.sender.id}/`}
                    className="list-group-item list-group-item-action border-0"
                  >
                    <small>
                      <div className="badge bg-success float-right text-white">
                        {moment.utc(msg.date).local().startOf('seconds').fromNow()}
                      </div>
                    </small>
                    <div className="d-flex align-items-start">
                      <img
                        src={msg.sender.id !== user_id ? msg.sender_profile.image : msg.reciever_profile.image}
                        className="rounded-circle mr-1"
                        alt="Profile"
                        width={40}
                        height={40}
                      />
                      <div className="flex-grow-1 ml-3">
                        {msg.sender.id === user_id ? msg.reciever_profile.full_name ?? msg.reciever.username : msg.sender.username}
                        <div className="small">
                          <small>{msg.message}</small>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>

              <div className="col-12 col-lg-7 col-xl-9">
                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                  <div className="d-flex align-items-center py-1">
                    <img src={profile.image} className="rounded-circle mr-1" alt="Profile" width={40} height={40} />
                    <div className="flex-grow-1 pl-3">
                      <strong>{profile.full_name}</strong>
                      <div className="text-muted small">
                        <em>@{username}</em>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="position-relative">
                  <div className="chat-messages p-4">
                    {message.map((msg, index) => (
                      <div key={index} className={`chat-message-${msg.sender.id !== user_id ? 'left' : 'right'} pb-4`}>
                        <img
                          src={msg.sender_profile.image}
                          className="rounded-circle mr-1"
                          alt="Profile"
                          width={40}
                          height={40}
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                          <div className="font-weight-bold mb-1">{msg.sender.id === user_id ? msg.reciever_profile.full_name : "You"}</div>
                          {msg.message}
                          <br />
                          <small>{moment.utc(msg.date).local().startOf('seconds').fromNow()}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-grow-0 py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                      value={newMessage.message}
                      name="message"
                      onChange={handleChange}
                    />
                    <button onClick={SendMessage} className="btn btn-primary">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MessageDetail;
