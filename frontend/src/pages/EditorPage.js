import { useAuth } from "../context/AuthContext";
import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import VersionCard from "../components/VersionCard";
import { initSocket } from "../services/socket";
import ACTIONS from '../constants/Actions';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import STORAGE_KEYS from "../constants/storageKeys";



const EditorPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const codeRef = useRef(null);
  const languageRef = useRef("javascript");
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [showSaveVersion, setShowSaveVersion] = useState(false);
  const [versionMessage, setVersionMessage] = useState("");
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoadingVersion, setIsLoadingVersion] = useState(false);

  const [roomName, setRoomName] = useState(
    location.state?.roomName || "Untitled Room"
  );
  const initialRoomName =
  location.state?.roomName || "Untitled Room";

  useEffect(() => {
    if (!user) {
      return;
    }
    const init = async () => {
      socketRef.current = await initSocket();
      setSocket(socketRef.current);
      socketRef.current.on('connect_error', (err) => {
        handleErrors(err)
      });
      socketRef.current.on('connect_failed', (err) => {
        handleErrors(err)
      });

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket Connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(
        ACTIONS.JOIN,
        {
          roomId,
          roomName: initialRoomName,
        }
      );

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {

          if (username !== user.username) {

            toast.success(`${username} joined the room`);

            socketRef.current.emit(
              ACTIONS.SYNC_CODE,
              {
                socketId,
                roomId
              }
            );

          }

          setClients(clients);

        }
      );

      // listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        })
      })


    }
    init();

    return () => {

      if (!socketRef.current) return;

      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

      socketRef.current.disconnect();

    };


  }, [roomId, reactNavigator, user, initialRoomName]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied to your clipboard')
    } catch (error) {
      toast.error('Could not copy Room Id');
      console.error(error);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  async function saveVersion() {

    if (!versionMessage.trim()) {
      toast.error("Version message is required");
      return;
    }

    try {

      setIsSavingVersion(true);

      const token = localStorage.getItem(
        STORAGE_KEYS.AUTH_TOKEN
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/versions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomId,
            message: versionMessage.trim(),
            code: codeRef.current || "",
            language: languageRef.current,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save version"
        );
      }

      toast.success("Version saved successfully");

      setVersionMessage("");
      setShowSaveVersion(false);

    } catch (error) {

      console.error(
        "❌ Save version error:",
        error
      );

      toast.error("Failed to save version");

    } finally {

      setIsSavingVersion(false);

    }
  }

  async function fetchVersions() {
    try {

      setIsLoadingVersions(true);

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/versions/room/${roomId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch versions"
        );
      }

      setVersions(data.versions || []);

    } catch (error) {

      console.error(
        "❌ Fetch versions error:",
        error
      );

      toast.error("Failed to load version history");

    } finally {

      setIsLoadingVersions(false);

    }
  }
  async function fetchVersion(versionId, versionNumber) {
    try {

      setIsLoadingVersion(true);
      setSelectedVersion(null);

      const token = localStorage.getItem(
        STORAGE_KEYS.AUTH_TOKEN
      );

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/versions/${versionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch version"
        );
      }

      setSelectedVersion({
        ...data.version,
        versionNumber,
      });

    } catch (error) {

      console.error(
        "❌ Fetch version error:",
        error
      );

      toast.error("Failed to load version");

    } finally {

      setIsLoadingVersion(false);

    }
  }

  return (
    <div className='main-wrap'>
      <div className='aside'>
        <div className='aside-inner'>
          <div className='logo'>
            <img
              src="/sync-code-logo.png" alt="sync-code-logo"
              className='logo-image'
            ></img>
          </div>

          {showVersionHistory ? (

            <div className="version-history-panel">

              <button
                type="button"
                className="version-history-back"
                onClick={() => setShowVersionHistory(false)}
              >
                ← Back
              </button>

              <div className="version-history-header">
                <h2 className="room-title">
                  📜 Version History
                </h2>
              </div>

              <hr className="sidebar-divider" />

              <div className="version-list">

                {isLoadingVersions ? (

                  <p className="version-empty">
                    Loading versions...
                  </p>

                ) : versions.length === 0 ? (

                  <p className="version-empty">
                    No saved versions yet.
                  </p>

                ) : (

                  versions.map((version, index) => (
                    <VersionCard
                      key={version.id}
                      version={version}
                      versionNumber={versions.length - index}
                      onClick={fetchVersion}
                    />
                  ))

                )}

              </div>
              {selectedVersion && (
                <div className="selected-version-panel">

                  <h3>
                    Version {selectedVersion.versionNumber}
                  </h3>

                  <p>
                    <strong>Message:</strong>{" "}
                    {selectedVersion.message}
                  </p>

                  <p>
                    <strong>Author:</strong>{" "}
                    {selectedVersion.username}
                  </p>

                  <p>
                    <strong>Language:</strong>{" "}
                    {selectedVersion.language}
                  </p>

                  <pre className="version-code-preview">
                    {isLoadingVersion
                      ? "Loading..."
                      : selectedVersion.code}
                  </pre>

                </div>
              )}
            </div>

          ) : (

            <>

              <div className="room-header">

                <h2 className="room-title">
                  📁 {roomName}
                </h2>

                <p className="participants-count">
                  👥 {clients.length} Participant{clients.length !== 1 ? "s" : ""}
                </p>

              </div>

              <hr className="sidebar-divider" />

              <div className="clients-list">

                {
                  clients.map((client) => (
                    <Client
                      key={client.socketId}
                      username={client.username}
                    />
                  ))
                }

              </div>

              <button
                type="button"
                className="version-history-btn"
                onClick={() => {
                  setShowVersionHistory(true);
                  fetchVersions();
                }}
              >
                📜 Version History
              </button>
              <button
                type="button"
                className="save-version-btn"
                onClick={() => setShowSaveVersion(true)}
              >
                💾 Save Version
              </button>

              {showSaveVersion && (
                <div className="save-version-panel">

                  <h3>💾 Save Current Version</h3>

                  <p>
                    Enter a message for this version.
                  </p>

                  <textarea
                    value={versionMessage}
                    onChange={(e) =>
                      setVersionMessage(e.target.value)
                    }
                    placeholder="e.g. Added login functionality"
                    maxLength={200}
                    rows={4}
                  />

                  <div className="save-version-actions">

                    <button
                      type="button"
                      onClick={() => {
                        setVersionMessage("");
                        setShowSaveVersion(false);
                      }}
                      disabled={isSavingVersion}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={saveVersion}
                      disabled={isSavingVersion}
                    >
                      {isSavingVersion
                        ? "Saving..."
                        : "Save Version"}
                    </button>

                  </div>

                </div>
              )}

            </>

          )}
        </div>
        <button className='btn copy-btn' onClick={copyRoomId}>COPY ROOM ID</button>
        <button className='btn leave-btn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editor-wrap'>
        <Editor
          socket={socket}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          onLanguageChange={(language) => {
            languageRef.current = language;
          }}
          onRoomNameChange={(name) => {
            setRoomName(name);
          }}
        />
      </div>
    </div>
  )
}

export default EditorPage;
