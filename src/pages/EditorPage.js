import React, { useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const EditorPage = ( ) => {
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
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

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({clients, username, socketId}) => {
          if(username !== location.state.username){
            toast.success(`${username} joined the room`);
          }
          setClients(clients);

        }
      );

      // listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        })
      })


    }
    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }

  }, []);

  
  if(! location.state){
    return <Navigate to="/" />
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

          <h3 className='connected'>connected</h3>

          <div className='clients-list'>
              {
                clients.map((client) => (
                  <Client key={client.socketId}username={client.username}/>
                ))
              }
          </div>
        </div>
      <button className='btn copy-btn'>Copy ROOM ID</button>
      <button className='btn leave-btn'>Leave</button>
      </div>
      <div className='editor-wrap'>
        <Editor/>
      </div>
    </div>
  )
}

export default EditorPage;
