import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SOCKET_URL = "http://localhost:3000";

export const ChatBox = ({ width }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null);
    const socketRef = useRef(null);
    const { roomCode } = useParams();
    const messagesEndRef = useRef(null);
    const [correctWord, setCorrectWord] = useState('');
    const [sketcher, setSketcher] = useState()

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit("joinRoom", roomCode);

        socketRef.current.on("chatMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socketRef.current.on('updateSketcher', ({ sketcher, word }) => {
            setCorrectWord(word);
            setSketcher(sketcher);
        })

        return () => {
            socketRef.current.off("chatMessage");
            socketRef.current.disconnect();
        };
    }, [roomCode]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !user) return;

        const newMessage = {
            id: Date.now(),
            senderUsername: user.username,
            text: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            roomCode
        };

        if (newMessage.senderUsername == sketcher) {
            setInput('');
            return;
        }

        if (input === correctWord) {
            toast({ description: 'You Got the correct word' });
            const username = user.username;
            socketRef.current.emit("wordGuessCorrected", {
                correctWord,
                roomCode,
                username
            });
            setInput("");
            return;
        }

        socketRef.current.emit("chatMessage", newMessage);
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
                                <p className="text-[11px] text-gray-300">
                                    {msg.senderUsername} : {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex items-center gap-1">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="px-2 py-2 rounded-full bg-white text-black focus:outline-none flex-1"
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
