import React, { useState, useEffect, useRef } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "EcoWarrior",
      text: "Has anyone tried the new organic fertilizer?",
      time: "10:30 AM",
    },
    {
      id: 2,
      user: "GreenThumb",
      text: "Yes! I used it last week and my tomatoes are looking great",
      time: "10:32 AM",
    },
    {
      id: 3,
      user: "SustainableSam",
      text: "Where can I get it?",
      time: "10:35 AM",
    },
    {
      id: 4,
      user: "EcoWarrior",
      text: "You can buy it from the co-op store",
      time: "10:36 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="chat-widget">
      <div className="card-header">
        <h2 className="card-title">Co-op Chat</h2>
        <div className="chat-status">
          <span className="status-indicator online"></span>
          <span className="status-text">12 members online</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.user === "You" ? "own-message" : ""}`}
          >
            <div className="message-header">
              <span className="message-user">{message.user}</span>
              <span className="message-time">{message.time}</span>
            </div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={2}
        />
        <Button variant="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>

      <div className="chat-actions">
        <Button variant="outline" size="small">
          📎 Attach
        </Button>
        <Button variant="outline" size="small">
          😊 Emoji
        </Button>
        <Button variant="outline" size="small">
          📷 Photo
        </Button>
      </div>
    </Card>
  );
};

export default Chat;
