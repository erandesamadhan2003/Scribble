import React, { useEffect, useState } from "react";

export const ChatBox = ({ width }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleSend = () => {
        if (!input.trim() || !user) return;

        const newMessage = {
            id: Date.now(),
            senderUsername: user.username,
            text: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
    };

    if (!user) {
        return (
            <div
                className="h-screen flex items-center justify-center text-white text-lg"
                style={{
                    width: `${width}%`,
                    background: "linear-gradient(to bottom right, #232526, #414345)",
                }}
            >
                Loading user...
            </div>
        );
    }

    return (
        <div
            className="h-screen flex flex-col justify-between p-4 overflow-hidden"
            style={{
                width: `${width}%`,
                background: "linear-gradient(to bottom right, #232526, #414345)",
            }}
        >
            <div className="text-white text-xl font-bold mb-4">Chat Room</div>

            <div className="flex-1 overflow-y-auto space-y-3 px-2">
                {messages.map((msg) => {
                    const isMe = msg.senderUsername === user.username;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs px-4 pt-2 rounded-xl shadow text-sm ${isMe
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                <p>{msg.text}</p>
                                    <p className="text-[11px] text-gray-300">{msg.senderUsername} : {msg.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-1">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="px-2 py-2 rounded-full bg-white text-black focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
