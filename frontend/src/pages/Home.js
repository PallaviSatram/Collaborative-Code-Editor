import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import STORAGE_KEYS from "../constants/storageKeys";

const Home = () => {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const [recentRoomsPage, setRecentRoomsPage] = useState(1);
  const [hasMoreRooms, setHasMoreRooms] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  async function fetchRecentRooms(page = 1) {

    try {

      setIsLoadingRooms(true);

      const token = localStorage.getItem(
        STORAGE_KEYS.AUTH_TOKEN
      );

      const response = await api.get(
        `/api/rooms/recent?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setRecentRooms(data.rooms || []);
      setRecentRoomsPage(data.page);
      setHasMoreRooms(data.hasMore);

    } catch (error) {

      console.error(
        "❌ Fetch recent rooms error:",
        error
      );

      toast.error(
        "Failed to load recent rooms"
      );

    } finally {

      setIsLoadingRooms(false);

    }

  }

  useEffect(() => {

    if (user) {
      fetchRecentRooms(1);
    }

  }, [user]);

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
  function openRoom(room) {

    navigate(`/editor/${room.room_id}`, {
      state: {
        roomName: room.room_name,
      },
    });

  }
  function goToNextRooms() {

    if (!hasMoreRooms || isLoadingRooms) {
      return;
    }

    fetchRecentRooms(
      recentRoomsPage + 1
    );

  }
  function goToPreviousRooms() {

    if (
      recentRoomsPage <= 1 ||
      isLoadingRooms
    ) {
      return;
    }

    fetchRecentRooms(
      recentRoomsPage - 1
    );

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

      <div className="home-header">

        <h1>
          Welcome to SyncCode 👋
        </h1>

        <h2 className="username">
          {user?.username}
        </h2>

      </div>


      <div className="dashboard-container">


        {/* LEFT SIDE - ROOM ACTIONS */}

        <div className="room-actions-card">

          <div className="card-title">

            <span className="card-icon">
              🚀
            </span>

            <div>
              <h2>
                Get Started
              </h2>

              <p>
                Create a new room or join an existing one.
              </p>
            </div>

          </div>


          {/* JOIN ROOM */}

          <div className="room-section">

            <label>
              Join Existing Room
            </label>

            <input
              type="text"
              className="input-box"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) =>
                setRoomId(e.target.value)
              }
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


          {/* CREATE ROOM */}

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


        {/* RIGHT SIDE - RECENT ROOMS */}

        <div className="recent-rooms-card">

          <div className="recent-rooms-header">

            <div className="card-title">

              <span className="card-icon">
                🕘
              </span>

              <div>

                <h2>
                  Recent Rooms
                </h2>

                <p>
                  Continue where you left off.
                </p>

              </div>

            </div>


            <span className="page-indicator">
              Page {recentRoomsPage}
            </span>

          </div>


          {isLoadingRooms ? (

            <div className="recent-rooms-message">
              Loading recent rooms...
            </div>

          ) : recentRooms.length === 0 ? (

            <div className="recent-rooms-empty">

              <div className="empty-icon">
                📂
              </div>

              <h3>
                No recent rooms
              </h3>

              <p>
                Create or join a room to see it here.
              </p>

            </div>

          ) : (

            <div className="recent-rooms-list">

              {recentRooms.map((room) => (

                <div
                  className="recent-room-card"
                  key={room.room_id}
                >

                  <div className="recent-room-main">

                    <div className="recent-room-icon">
                      📁
                    </div>

                    <div className="recent-room-info">

                      <h3>
                        {room.room_name}
                      </h3>

                      <div className="recent-room-meta">

                        <span>
                          💻 {room.current_language}
                        </span>

                        <span>
                          🕐{" "}
                          {new Date(
                            room.joined_at
                          ).toLocaleString()}
                        </span>

                      </div>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="open-room-btn"
                    onClick={() =>
                      openRoom(room)
                    }
                  >
                    Open
                  </button>

                </div>

              ))}

            </div>

          )}


          {/* PAGINATION */}

          {recentRooms.length > 0 && (

            <div className="recent-rooms-pagination">

              <button
                type="button"
                onClick={goToPreviousRooms}
                disabled={
                  recentRoomsPage === 1 ||
                  isLoadingRooms
                }
              >
                ← Previous
              </button>

              <span>
                {recentRoomsPage}
              </span>

              <button
                type="button"
                onClick={goToNextRooms}
                disabled={
                  !hasMoreRooms ||
                  isLoadingRooms
                }
              >
                Next →
              </button>

            </div>

          )}

        </div>

      </div>


      <footer>

        Built with ⭐ by{" "}

        <a
          href="https://github.com/PallaviSatram"
          target="_blank"
          rel="noreferrer"
        >
          Pallavi Satram
        </a>

      </footer>

    </div>
  );

};

export default Home;