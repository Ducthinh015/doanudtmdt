import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import ichatImg from "../../assets/ichat.jpg";

const Endpoint = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Chatbot = () => {
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const role = useSelector((state) => state.auth.role);

  //runs once after connection is made
  useEffect(() => {
    const s = io(Endpoint);
    setSocket(s);
    s.on("botMessage", (incoming) => {
      setMsg((prev) => [...prev, { sender: "bot", text: incoming }]);
    });
    return () => {
      s.off("botMessage");
      s.disconnect();
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

  // Hide chatbot for admin users
  if (role === "admin") return null;

  return (
    <div>
      {isOpen ? (
        <div className="bg-white/30 backdrop-blur-md rounded border w-72">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <h3 className="text-center">iChat</h3>
            <button className="text-xs text-black" onClick={() => setIsOpen(false)}>
              Ẩn
            </button>
          </div>
          <div className="h-56 p-5 overflow-y-auto border">
            {msg.map((m, i) => (
              <div
                key={i}
                className={`m-2 p-2 rounded-md text-sm ${
                  m.sender === "bot"
                    ? "bg-blue-300 text-black text-left"
                    : "bg-blue-200 text-black text-right"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-2 py-2">
            <input
              className="text-black flex-1 border rounded px-2 py-1"
              value={input}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
            />
            <button className="p-2 bg-white rounded" onClick={handleSend}>
              <AiOutlineSend />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="rounded-full shadow overflow-hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Mở iChat"
          title="Mở iChat"
        >
          <img src={ichatImg} alt="Mở iChat" className="w-12 h-12 object-cover" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
