import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";
import '../styles/MemberProfile.css';
import { Message } from "../types";

// Component that allows users to view a team member's profile, send messages (with or without attachments), and email them
export const MemberProfile = () => {
  // Extract username from URL parameters
  const { username } = useParams();

  // State for messaging and UI behavior
  const [receiver, setReceiver] = useState<number>();
  const [showMessage, setShowMsg] = useState(false);
  const [message, setMessage] = useState<String>('');
  const [converstaiton, setConverstation] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<number | null>(null);
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  // Email defaults
  const emailSubject = encodeURIComponent("Hello from Project Tracker");
  const emailBody = encodeURIComponent(`Hi ${username},\n\nI wanted to reach out to you via email.`);

  // Base URL from environment variables
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [converstaiton]);

  // Open email client with prefilled subject and body
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

  // Send message with optional file attachment
  const sendMessageWithFile = async () => {
    if (!message || message.trim() === '') {
      alert('Enter some message to send this attachment.');
      return;
    }

    // If no file, just send regular message
    if (!fileInputRef.current?.files?.[0]) {
      sendMessage();
      return;
    }

    const formData = new FormData();
    if (currentUser != null && receiver != null) {
      formData.append("SenderId", currentUser.toString());
      formData.append("ReceiverId", receiver.toString());
      formData.append("MessageText", message.toString());
      formData.append("file", fileInputRef.current.files[0]);

      const response = await fetch(`${baseUrl}/api/messages/send-with-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Upload failed:", error);
      } else {
        const result = await response.json();
        console.log("Uploaded message:", result);
        setMessage(""); // Clear input after success
      }
    }
  };

  // Load current user ID from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem('userid');
    if (storedId !== null) {
      setCurrentUser(Number(storedId));
    }
  }, []);

  // Load receiver ID from localStorage (e.g., selected member)
  useEffect(() => {
    const saved = localStorage.getItem('Receiver');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReceiver(parsed);
      } catch (e) {
        console.error('Error parsing Receiver ID from localStorage');
      }
    }
  }, []);

  // Fetch messages repeatedly every 0.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (receiver && currentUser) {
        fetchMessages();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [receiver, currentUser]);

  // Send a notification after sending a message
  const sendNotification = async () => {
    try {
      const Notification = {
        SenderId: currentUser,
        ReceiverId: receiver,
        IsRead: false,
        CreatedAt: new Date().toISOString(),
        Message: localStorage.getItem("yourUserName") + " sent you a message.",
        NotificationLink: baseUrl + "/" + username + "/view=true"
      };

      const response = await fetch(`${baseUrl}/api/messages/send-notification`, {
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

  // Send a regular message without file
  const sendMessage = async () => {
    try {
      const MsgInfo = {
        MessageText: message,
        SenderId: currentUser,
        ReceiverId: receiver,
      };

      const response = await fetch(`${baseUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(MsgInfo)
      });

      const result = await response.json();
      if (response.ok) {
        sendNotification();
        fetchMessages();
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("There is error sending message.");
    }
  };

  // Fetch messages between current user and receiver
  const fetchMessages = async () => {
    try {
      const MsgInfo = {
        MessageText: '',
        SenderId: currentUser,
        ReceiverId: receiver,
      };

      const response = await fetch(`${baseUrl}/api/messages/get-messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSO
