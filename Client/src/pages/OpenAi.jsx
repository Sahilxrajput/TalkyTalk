// ChatInput.jsx
import { useState } from "react";
import axios from "axios";

function ChatInput() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat` , { message: input });
    console.log(res.data)
    setMessages([...messages, { role: "user", content: input }, res.data]);
    setInput("");
  };

  return (
    <div className="h-screen w-screen bg-[#121212] text-white flex items-center justify-center">
      <div>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
export default ChatInput;
