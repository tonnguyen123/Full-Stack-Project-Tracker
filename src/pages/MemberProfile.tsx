import { useState, useEffect , useRef }from "react";
import { useParams } from "react-router-dom"
import { NavigationBar } from "./NavigationBar";
import '../styles/MemberProfile.css'
import { Message } from "../types";


export const MemberProfile = () => {
    const {username} = useParams();
    const [receiver, setReceiver] = useState<number>();
    const[showMessage,setShowMsg] = useState(false);
    const [message,setMessage] = useState<String>('');
    const [converstaiton, setConverstation] = useState<Message[]>([]);
    const [currentUser, setCurrentUser] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);



    const [showEmailOptions, setShowEmailOptions] = useState(false);

    const emailSubject = encodeURIComponent("Hello from Project Tracker");
    const emailBody = encodeURIComponent("Hi " + username + ",\n\nI wanted to reach out to you via email.");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    }

    useEffect(()=>{
      scrollToBottom();
    },[converstaiton]);

    const openEmailClient = (type: 'gmail' | 'outlook' | 'yahoo') => {
    let url = '';

    switch (type) {
        case 'gmail':
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${emailSubject}&body=${emailBody}`;
        break;
        case 'outlook':
        url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=&subject=${emailSubject}&body=${emailBody}`;
        break;
        case 'yahoo':
        url = `http://compose.mail.yahoo.com/?to=&subj=${emailSubject}&body=${emailBody}`;
        break;
    }

    window.open(url, '_blank');
    };

    const sendMessageWithFile = async () => {
        if (!message || message.trim() === '') {
          alert('Enter some message to send this attachment.')
        }
      
        const formData = new FormData();
      
        if (currentUser != null && receiver != null) {
          formData.append("SenderId", currentUser.toString());
          formData.append("ReceiverId", receiver.toString());
          formData.append("MessageText", message.toString());
      
          if (fileInputRef.current?.files?.[0]) {
            formData.append("file", fileInputRef.current.files[0]);
          }
          else{
            sendMessage();
          }
      
          const response = await fetch("http://localhost:5041/api/messages/send-with-file", {
            method: "POST",
            body: formData,
          });
      
          if (!response.ok) {
            const error = await response.text();
            console.error("Upload failed:", error);
          } else {
            const result = await response.json();
            console.log("Uploaded message:", result);
            setMessage(""); // reset message after sending
          }
      
          console.log("Sending FormData", formData.get("file"));
        }
      };
      
      





        useEffect(() => {
        const storedId = localStorage.getItem('userid');
        if (storedId !== null) {
            setCurrentUser(Number(storedId));
        }
        }, []);



    
    


    useEffect(() => {
        const saved = localStorage.getItem('Receiver');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setReceiver(parsed);
          } catch (e) {
            console.error('Error parsing teamData from localStorage');
          }
        }
      }, []);

      useEffect(() => {
        const interval = setInterval(() => {
          if (receiver && currentUser) {
            fetchMessages();
          }
        }, 500); // fetch every 0.5 seconds
      
        return () => clearInterval(interval); // clean up
      }, [receiver, currentUser]);

      const sendNotification = async () => {
        try {
          const Notification = {
            SenderId: currentUser,
            ReceiverId: receiver,
            IsRead: false,
            CreatedAt: new Date().toISOString(),
            Message: localStorage.getItem("yourUserName") + " sent you a message.",
            NotificationLink: "http://localhost:5173/member/" + username + "/view=true"
          };
      
          const response = await fetch('http://localhost:5041/api/messages/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Notification)
          });
      
          const result = await response.json();
          console.log("Notification response:", result);
      
          if (response.ok) {
            fetchMessages();
            alert(result.message || "Notification sent!");
          } else {
            alert(result.message || "Failed to send message.");
          }
        } catch (error) {
          console.error("Notification error:", error);
          alert("Error sending notification");
        }
      };
      
      


      const sendMessage = async () => {
        console.log("Receiver's id is " + receiver);
        try {
            const MsgInfo = {
                MessageText: message,
                SenderId: currentUser,
                ReceiverId: receiver,

            }
            const response = await fetch('http://localhost:5041/api/messages',{
                method: 'POST',
                headers:{'Content-Type': 'application/json' },
                body: JSON.stringify(MsgInfo)
            });
            const result = await response.json();
            if(response.ok){
                sendNotification();
                fetchMessages();
                alert(result.message);
            }
            else{
                alert(result.message);
            }

        } catch (error) {
            alert("There is error sending message.");
        }
      }

      const fetchMessages = async() =>{
        try {
            const MsgInfo = {
                MessageText: '',
                SenderId: currentUser,
                ReceiverId: receiver,

            }
            const response = await fetch('http://localhost:5041/api/messages/get-messages',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(MsgInfo)
            });
            const result = await response.json();
            if(response.ok){
                setConverstation(result);
                console.log("Fetched messages:", result);
            }
            else{
                alert(result.message);
            }

        } catch (error) {
            alert("There is error fetching messages.");
        }
      }
      


  return (
    <div>
        <NavigationBar></NavigationBar>
        <div className="TitleAndButtons">
        <h3>
        Team member: {username}
        </h3>
        <button style={{marginRight: '10px', backgroundColor:'blue'}} onClick={()=>{setShowMsg(true); setShowEmailOptions(!showEmailOptions)}}>
        <i className="fa-solid fa-message" > </i>
        </button>
        <button style={{marginRight: '10px', backgroundColor:'green'}} >
        <i className="fa-solid fa-envelope"  onClick={() => setShowEmailOptions(!showEmailOptions)}></i>
        </button>

        <div>
            {
                showMessage === true && (
                    <div className="MessageSection">
                        <div className="chat">
                        <div className="chatName">
                            <span style={{color:'white'}}>Message to {username}</span>
                            <button onClick={()=>setShowMsg(false)}><i className="fa-solid fa-rectangle-xmark" ></i></button>
                        </div>
                        <div className="textSection">
                        {converstaiton.map((message, index) => {
                        
                        

                        return (
                            <div key={index}>
                            {Number(message.senderId) === Number(currentUser) ? (
                                <div>
                                <span style={{ fontWeight: 'bold' }}>Me </span>
                                <span>({new Date (message.timestamp + "Z").toLocaleString()}): </span>
                                <span>{message.messageText}</span>
                                {message.filePath && (
                                    <div>
                                    <a href={`http://localhost:5041/api/messages/download?filePath=${encodeURI(message.filePath)}&fileName=${message.fileName}`} download>
                                        📎 {message.fileName}
                                    </a>
                                    </div>
                                )}
                                </div>
                            ) : (
                                <div>
                                <span style={{ fontWeight: 'bold' }}>{username} </span>
                                <span>({new Date (message.timestamp + "Z").toLocaleString()}): </span>
                                <span>{message.messageText}</span>
                                {message.filePath && (
                                    <div>
                                    <a href={`http://localhost:5041/api/messages/download?filePath=${encodeURI(message.filePath)}&fileName=${message.fileName}`} download>
                                        📎 {message.fileName}
                                    </a>
                                    </div>
                                )}
                                </div>
                            )}
                            </div>
                        );
                        })}
                        <div ref={messagesEndRef}/>

          




                        </div>

                        </div>
                        
                        <textarea onChange={(e)=>setMessage(e.target.value)} placeholder="Enter your message"></textarea>
                        <button onClick={()=>sendMessageWithFile()} style={{backgroundColor:'green'}}>
                        <i className="fa-regular fa-paper-plane"></i>
                        </button>

                        <input type="file" ref={fileInputRef}></input>
                        

                    </div>
                )

            }

            {showEmailOptions && (
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => openEmailClient('gmail')} style={{marginRight:'5px', backgroundColor:'white', color:'red'}}><i className="fa-brands fa-google" ></i></button>
                <button onClick={() => openEmailClient('outlook') } style={{marginRight:'5px', backgroundColor:'blue'}}>Outlook</button>
                <button onClick={() => openEmailClient('yahoo')} style={{marginRight:'5px', backgroundColor:'PURPLE'}}><i className="fa-brands fa-yahoo"></i></button>
            </div>
            )}

            
        </div>

        </div>
       
        
        
    </div>
  )
}
