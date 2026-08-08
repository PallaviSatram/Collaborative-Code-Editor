import { useAuth } from "../context/AuthContext";
import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from "../services/socket";
import ACTIONS from '../constants/Actions';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';


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
  const [roomName, setRoomName] = useState(
    location.state?.roomName || "Untitled Room"
  );

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
          roomName:
            location.state?.roomName ||
            "Untitled Room",
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


  }, [roomId, reactNavigator, user]);

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

          <div className="room-header">

            <h2 className="room-title">

              📁 {roomName}

            </h2>
            <p className="participants-count">

              👥 {clients.length} Participant{clients.length !== 1 ? "s" : ""}

            </p>

          </div>

          <hr className="sidebar-divider"/>

          <div className='clients-list'>
            {
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
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
