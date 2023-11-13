import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChatBody = ({ socket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState('');
  const [qres,setQres]=useState([])
  const username = location.state?.username || 'Anonymous';
  const [pid,setPid]=useState([]);

  //FINDING THE DISTINCT PROJECTS WORKED ON
  useEffect(() => {
    const getRecords = async () => {
      try {
        const response = await fetch("http://localhost:3000/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'username':username}),
        });

        if (!response.ok) {
          throw new Error("HTTP error:"+response.status);
        }

        const data = await response.json();
        setResult(data);
        console.log("data"+JSON.stringify(data))
      } catch (err) {
        console.error(err);
      }
    };

    getRecords();
  }, []);

  //GO BACK TO FREELANCER PROFILE PAGE
  const handleBack = () => {
    navigate('/freelancer_profile',{state:{username:username}});
  };

  //SEND NEW MESSAGE TO DB AND UPDATE MESSAGES DISPLAYED
  const handleSendMessage = (e) => {
    e.preventDefault();
    //SENDS THE MESSAGE THROUGH THE SOCKET ESTABLISHED
    if (message.trim() && username) {
      socket.emit('message', {
        text: message,
        name: username,
        project_id: pid,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    
    //UPDATES THE MESSAGES DISPLAYED
    qres.chats.push(message);
    qres.username.push(username);
    setQres(qres)
    setMessage('');
    }
  };

  //RETRIEVING PREVIOUS CHATS FROM DB 
  const handleClick=async (val)=>{
    console.log("pid:"+val)
    try {
      const response = await fetch('http://localhost:3000/chat_display', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'username':username,'pid':val}), 
      });

      if (!response.ok) {
        throw new Error('nope not working'); 
      }
      setPid(val)
      const data = await response.json();
      setQres(data);
      console.log("data"+JSON.stringify(data))
      
      // Handle success, if needed
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  }

  return (
    <div className='chat'>
      <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">Groups</h4>
        <div className="chat__users">
        {result.pid?.map((row, index) => (
          <div key={index}>
            <div>
              <button value={row} onClick={e=>handleClick(e.target.value)}>{row}</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
    <div className='chat__main'>
      <header className="chat__mainHeader">
        <p>Chats</p>
        <button className="leaveChat__btn" onClick={handleBack}>
          BACK
        </button>
      </header>

  <div id="message__container">
    {qres.chats?.map((row, index) => (
    <div key={index} className="message__chats">
      {qres.username[index] === username ? (
        <div className="message__chats">
        <p className="sender__name">You</p>
        <div className='message__sender'>
          <p>{row}</p>
        </div>
        <p className="sender__name" >{qres.timestamp[index]}</p>
        </div>

      ) : (
        <div className="message__chats">
        <p>{qres.username[index]}</p>
        <div className="message__recipient">
          <p>{row}</p>
        </div>
        <p>{qres.timestamp[index]}</p>
      </div>
      )}
      
    </div>
  ))}
</div>


      <div className="chat__footer">
        <form className="form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Write message"
            className="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="sendBtn">SEND</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ChatBody;