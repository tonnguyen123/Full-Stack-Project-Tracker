import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Navigationbar.css';
import { Notification } from '../types';




export const NavigationBar = () => {
    const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
      const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
      const token = localStorage.getItem("token");

      const ReceiverID = Number(localStorage.getItem('userid'));
     
      const [notificationList,setNotificationList] = useState<Notification[]>([]);
      const[AllRead,setAllRead] = useState(false);


      const baseUrl = import.meta.env.VITE_SERVER_URL;
      
        const navigate = useNavigate();

        const fetchNotifications = async () => {
          try {
            const response = await fetch(`${baseUrl}/api/messages/get-notifications/${ReceiverID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            const result = await response.json();
            if (response.ok) {
              setNotificationList(result.reverse());
              console.log("Notifications: " + JSON.stringify(result, null, 2)); // Pretty print JSON

              const allRead = result.every((n: Notification) => n.isRead);
              setAllRead(allRead);
            }
          } catch (error) {
            console.log("Error fetching notifications.");
          }
        };
        
        const handleMouseEnter = (menu: string) => {
          if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
          }
          setHoveredDropdown(menu);
        };

        const handleMouseLeave = () => {
            hoverTimeout.current = setTimeout(() => {
              setHoveredDropdown(null);
            }, 300); // Delay to prevent flickering
          };


          useEffect(()=>{
            const interval = setInterval(() => {
              fetchNotifications();
              checkIfAllRead();
              
            },500);
            return () => clearInterval(interval);
          },[ReceiverID]);



          const Logout = () =>{
            localStorage.removeItem("token");
            window.location.href = '/login';
            
          }

          const checkIfAllRead = () => {
            const allRead = notificationList.every(n => n.isRead);
            setAllRead(allRead);
          };
          
          

          const handleSection = (chosenSection: string) => {
            if(chosenSection === 'create-project'){
              navigate('/create-project');
            }
            else if (chosenSection === 'view-schedule'){
              navigate('/calendar');
            }
            else if(chosenSection === 'view-teams' || chosenSection === 'view-teams'){
              navigate('/teams')
            }
            else if(chosenSection === 'create-task'){

            }
            
          }

          const gotToLink = async(notification: Notification) => {
            try {
              const url = new URL(notification.notificationLink);
              const path = url.pathname; 
              const cleanPath = path.replace('/view=true', '');
              await markasRead(notification);
              await fetchNotifications();
              checkIfAllRead();
              navigate(cleanPath);

            } catch (error) {
              console.error("Invalid URL:", notification.notificationLink);
            }
          };
          

          const markasRead = async(notification: Notification) => {
            try {
              const response = await fetch(`${baseUrl}/api/messages/mark-as-read`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(notification)
              });
              const result = await response.json();
              console.log(result.message);
            } catch (error) {
              console.log("Error marking notification read");
            }
          }
          
          const timeAgo = (dateInput: string | Date) => {
            const created = new Date(dateInput);
            if (isNaN(created.getTime())) return 'Invalid date';
          
            const now = new Date();
            const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
          
            if (seconds < 60) return `Just now`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
            const weeks = Math.floor(days / 7);
            if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
            const months = Math.floor(days / 30);
            if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
            const years = Math.floor(days / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
          };
          
          
          


  return (
    <div className='NavigationBar'>

        <button className='home-button' onClick={()=>navigate(`/projects/${token}`)}>
          <span className='title' style={{ marginRight: '5px' }}>Home</span>
          <i className="fa-solid fa-house nav-icon"></i>
        </button>

        <div>
          <button className='searchButton'>
            <i className="fa-solid fa-magnifying-glass nav-icon"></i>
          </button>
          <input className='searchBox' placeholder='Search your Projects, Tasks or Teams' />
        </div>

        {/* Create Dropdown */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter('create')}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <span className='title' style={{ marginRight: '5px' }}>Create</span>
            <i className="fa-solid fa-square-plus nav-icon"></i>
          </button>
          {hoveredDropdown === 'create' && (
            <div className="dropdown">
              <button  onClick={()=>handleSection('create-project')}>Create Project Tracker</button>
              <button onClick={()=>handleSection('create-task')}>Create Task</button>
            </div>
          )}
        </div>

        {/* Teams Dropdown */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter('teams')}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <span className='title' style={{ marginRight: '5px' }}>Teams</span>
            <i className="fa-solid fa-people-group nav-icon"></i>
          </button>
          {hoveredDropdown === 'teams' && (
            <div className="dropdown">
              <button onClick={()=>handleSection('view-teams')}>View Teams</button>
              <button onClick={()=>handleSection('create-team')}>Create New Team</button>
            </div>
          )}
        </div>

        {/* Calendar Dropdown */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter('calendar')}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <span className='title' style={{ marginRight: '5px' }}>Calendar</span>
            <i className="fa-solid fa-calendar nav-icon"></i>
          </button>
          {hoveredDropdown === 'calendar' && (
            <div className="dropdown">
              <button onClick={()=>handleSection('view-schedule')}>View Schedule</button>
              <button onClick={()=>handleSection('view-deadlines')}>View Deadlines</button>
            </div>
          )}
        </div>

      

                {/* Notifications Dropdown */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter('notifications')}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <span className='title' style={{ marginRight: '5px' }}>Notifications</span>
            <i className="fa-solid fa-bell nav-icon"></i>
            {!AllRead && <span className='red-dot'></span>}
          </button>
          {hoveredDropdown === 'notifications' && (
            <div className="dropdown">
              {notificationList.length > 0 ? (
                notificationList.map((notification, index) => (
                  <div>
                    {
                      notification.isRead === false ? (
                        <div>
                          <button style={{backgroundColor:'blue'}}  onClick={()=>gotToLink(notification)}  key={index}>
                          {notification.notificationLink}
                          <small style={{ fontSize: '0.75rem', color: 'black', marginLeft:'5px' }}>
                          {timeAgo(notification.createdAt)}
                          
                        </small>
                          
                    
                    </button>

                        </div>
                      ): (
                        <div>
                          <button style={{backgroundColor:'gray'}}  onClick={()=>gotToLink(notification)}  key={index}>
                          {notification.message}
                          <small style={{ fontSize: '0.75rem', color: 'black', marginLeft:'5px'  }}>
                          {timeAgo(notification.createdAt)}
                          
                        </small>
                        <span></span>
                    
                    </button>

                        </div>
                      )
                    }
                     
                  </div>
                  
                 
                ))
              ) : (
                <span style={{ padding: '5px' }}>No notifications</span>
              )}
            </div>
          )}
        </div>


        {/* Profile Dropdown */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => handleMouseEnter('profile')}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <span className='title' style={{ marginRight: '5px' }}>Your Profile</span>
            <i className="fas fa-user nav-icon"></i>
          </button>
          {hoveredDropdown === 'profile' && (
            <div className="dropdown">
              <button onClick={()=> navigate(`/update-profile/${token}`)}>Update Profile</button>
              <button onClick={()=> Logout()}>Log Out</button>
            </div>
          )}
        </div>
      </div>
  )
}
