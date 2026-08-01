import React, { useState } from "react";
import { v4 as uuidv4} from "uuid";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new Room')
  };

  const joinRoom = () => {
    if(!roomId || !username){
      toast.error('Room Id & Username is required');
      return;
    }

    // redirect
    navigate(`/editor/${roomId}`, {
      state : {
        username,
      }
    })

  };

  const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
      joinRoom();
    }
      
    
  };

  return (
    <div className="homePageWrapper">

  <div className="contentWrapper">

    <img
      src="/sync-code-logo.png"
      alt="logo"
      className="home-page-logo"
    />

    <div className="formWrapper">

      <h4 className="main-label">
        Paste invitation Room ID
      </h4>

      <div className="input-group">

        <input
          type="text"
          className="input-box"
          placeholder="Room ID"
          onChange={(e) => {
            setRoomId(e.target.value)
          }}
          value={roomId}
          onKeyUp={handleInputEnter}
        />

        <input
          type="text"
          className="input-box"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value)
          }}
          value={username}
          onKeyUp={handleInputEnter}
        />

        <button className="btn join-btn" onClick={joinRoom}>
          Join
        </button>

        <span className="create-info"> If you don't have an invite then create <a href="/" onClick={createNewRoom} className="create-new-btn">new Room</a> </span>

      </div>
    </div>

  </div>
  <footer>
        <h4>Built with ⭐ by <a href="https://github.com/PallaviSatram">Pallavi Satram</a></h4>
      </footer>
</div>
  )
}

export default Home;