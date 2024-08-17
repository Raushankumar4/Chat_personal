import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_SERVER;

const socket = io(backendUrl);

const ChatApp = () => {
  const [username, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for incoming messagesen
    socket.on("recevied-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup socket listener on unmount
    return () => socket.off("recevied-message");
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      alert("Message can't be empty");
      return;
    }
    const messageData = {
      message: newMessage,
      user: username,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    socket.emit("send-message", messageData);
    setNewMessage("");
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center m-auto p-auto">
      {chatActive ? (
        <div className="rounded-md w-full md:w-[80vw] lg:w-[40vw] h-[70vh] mx-auto flex flex-col">
          <h1 className="tracking-wider text-center font-bold drop-shadow-md shadow-green-600 lg:text-4xl text-2xl my-2 bungee-tint-regular">
            Personal Chat
          </h1>
          <div className="scrollable-element flex-grow overflow-auto px-4 bungee-tint-regular2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex rounded-md shadow-md my-2 bg-white w-1/2  ${
                  username === message.user && "ml-auto"
                }`}
              >
                <div className="bg-green-400 flex items-center justify-center rounded-l-md px-2">
                  <h3 className="font-bold text-lg text-white">
                    {message.user.charAt(0).toUpperCase()}
                  </h3>
                </div>
                <div className="px-2 py-2 space-y-2">
                  <span className="font-medium uppercase tracking-normal">
                    @{message.user}
                  </span>
                  <h3 className="font-bold text-pretty tracking-wide">
                    {message.message}
                  </h3>
                  <h4 className="ml-[12vw] text-sm text-right">
                    {message.time}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleOnSubmit} className="flex gap-2 p-4 lg:mx-4 mx-[10vw]">
            <input
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              type="text"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="bg-green-500 text-white font-bold px-4 py-2 rounded-md shadow-md"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="font-semibold text-2xl drop-shadow-2xl shadow-gray-700">
            Enter UserName
          </h1>
          <input
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            className="text-center px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your username"
          />
          <button
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md"
            type="button"
            onClick={() => username.trim() && setChatActive(true)}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
