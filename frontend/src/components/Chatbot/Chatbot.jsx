import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";

const Endpoint = "http://localhost:1000";

const Chatbot = () => {
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  //runs once after connection is made
  useEffect(() => {
    const s = io(Endpoint);
    s.on("botMessage", (msg) => {
      setMsg((prev) => [...prev, { sender: "bot", text: msg }]);
    });
    // Cleanup function
    return () => {
      s.off("botMessage"); // stop listening
      s.disconnect(); // close socket connection
    };
  }, []);
  const handleSend = () => {
    if (!input.trim() || !socket) return;
    setMsg((prev) => [...prev, { text: input, sender: "user" }]);
    socket.emit("userMessage", input);

    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded border">
      <h3 className="text-center">iChat</h3>
      <div className="h-56 p-5 overflow-y-auto border">
        {msg.map((m, i) => (
          <div
            key={i}
            className={`m-2 p-2 rounded-md text-sm ${
              m.sender === "bot"
                ? "bg-blue-300e text-black text-left"
                : "bg-blue-200 text-black text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input
        className="text-black w-[91%] border-none"
        value={input}
        onChange={handleInputChange}
        placeholder="Type here..."
      />
      <button className=" " onClick={handleSend}>
        <AiOutlineSend />
      </button>
    </div>
  );
};

export default Chatbot;
