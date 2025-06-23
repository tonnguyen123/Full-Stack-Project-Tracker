import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Navigationbar.css';
import { Notification } from '../types';

// Navigation bar component that handles navigation, dropdowns, and notifications
export const NavigationBar = () => {
  // State to track currently hovered dropdown
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth token and user ID
  const token = localStorage.getItem("token");
  const ReceiverID = Number(localStorage.getItem('userid'));

  // Notifications state
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [AllRead, setAllRead] = useState(false);

  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  // Fetch user notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/messages/get-notifications/${ReceiverID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (response.ok) {
        setNotificationList(result.reverse()); // show newest first
        console.log("Notifications: " + JSON.stringify(result, null, 2));
        setAllRead(result.every((n: Notification) => n.isRead));
      }
    } catch (error) {
      console.log("Error fetching notifications.");
    }
  };

  // Hover handler to open dropdown
  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredDropdown(menu);
  };

  // Hide dropdown after a short delay (to avoid flickering)
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredDropdown(null), 300);
  };

  // Fetch notifications every 0.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
      checkIfAllRead();
    }, 500);
    return () => clearInterval(interval);
  }, [ReceiverID]);

  // Log out the user
  const Logout = () => {
    localStorage.removeItem("token");
    window.location.href = '/login';
  };

  // Check if all notifications are read
  const checkIfAllRead = () => {
    setAllRead(notificationList.every(n => n.isRead));
  };

  // Navigate to the correct section
  const handleSection = (chosenSection: string) => {
    if (chosenSection === 'create-project') navigate('/create-project');
    else if (chosenSection === 'view-schedule') navigate('/calendar');
    else if (chosenSection === 'view-teams') navigate('/teams');
    else if (chosenSection === 'create-task') {
      // future implementation
    }
  };

  // Go to notification link and mark as read
  const gotToLink = async (notification: Notification) => {
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

  // Mark notification as read on backend
  const markasRead = async (notification: Notification) => {
    try {
      const response = await fetch(`${baseUrl}/api/messages/mark-as-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.log("Error marking notification read");
    }
  };

  // Utility to format timestamps into "x minutes ago"
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
    const years = M
