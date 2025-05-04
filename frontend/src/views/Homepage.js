import React from "react";
import "./Homepage.css";

function Homepage() {
  return (
    <div>
      <main style={{ marginTop: 50 }}>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="container">
            <h1>Connect Instantly, Chat Seamlessly</h1>
            <p className="lead">
              Welcome to Chatify – your go-to platform for secure, real-time conversations with friends, family, and teams.
            </p>
            <div className="cta-buttons">
              <a className="btn btn-light btn-lg" href="/signup" role="button">
                Get Started
              </a>
              <a className="btn btn-outline-light btn-lg ml-3" href="/login" role="button">
                Login
              </a>
            </div>
          </div>
        </div>

        {/* Optional Feature Highlights */}
        <div className="container features-section">
          <div className="feature-box">
            <h2>💬 Real-Time Messaging</h2>
            <p>Experience lightning-fast communication with our WebSocket-powered chat engine.</p>
          </div>
          <div className="feature-box">
            <h2>🔐 End-to-End Encryption</h2>
            <p>Your messages are secured with industry-standard encryption so only you and your recipient can read them.</p>
          </div>
          <div className="feature-box">
            <h2>👥 Group Chats</h2>
            <p>Stay connected with your friends, family, or teams through unlimited group messaging.</p>
          </div>
        </div>
      </main>

      <footer className="text-center">
        <p>© 2024 Chatify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;
