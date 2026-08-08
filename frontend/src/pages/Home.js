import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useAuth } from "../context/AuthContext";

const Home = () => {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");

  function createNewRoom() {

    const id = uuidv4();

    setRoomId(id);

    navigate(`/editor/${id}`, {
      state: {
        roomName:
          roomName.trim() || "Untitled Room",
      },
    });

  }

  function joinRoom() {

    if (!roomId) {

      toast.error("Room ID is required.");

      return;

    }

    navigate(`/editor/${roomId}`);

  }

  function handleInputEnter(e) {

    if (e.code === "Enter") {

      joinRoom();

    }

  }

  function handleLogout() {

    logout();

    toast.success("Logged out successfully.");

    navigate("/login");

  }

  return (
    <div className="home-page">
      <div className="home-card">
        <h1>
          Welcome to SyncCode 👋
        </h1>
        <h2 className="username">
          {user?.username}
        </h2>

        <div className="room-section">
          <label>
            Join Existing Room
          </label>

          <input
            type="text"
            className="input-box"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          <button
            className="btn join-btn"
            onClick={joinRoom}
          >

            Join Room

          </button>

        </div>

        <div className="divider">

          <span>OR</span>

        </div>
        <div className="room-section">

          <label>

            Create New Room

          </label>

          <input
            type="text"
            className="input-box"
            placeholder="Room Name (Optional)"
            value={roomName}
            onChange={(e) =>
              setRoomName(e.target.value)
            }
          />

          <button
            className="btn create-btn"
            onClick={createNewRoom}
          >

            Create Room

          </button>

        </div>

        <button
          className="btn logout-btn"
          onClick={handleLogout}
        >

          Logout

        </button>

      </div>

      <footer>

        Built with ⭐ by

        {" "}

        <a href="https://github.com/PallaviSatram">

          Pallavi Satram

        </a>

      </footer>

    </div>

  );

};

export default Home;