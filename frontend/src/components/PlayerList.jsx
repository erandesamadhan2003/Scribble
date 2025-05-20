import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PlayerList = ({ width }) => {
    const [room, setRoom] = useState(null);
    const { roomCode } = useParams();

    useEffect(() => {
        console.log("RoomCode",roomCode)
        const fetchroomDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/room/getRoom/${roomCode}`);

                const data = await response.json();
                setRoom(data.room);
            } catch (error) {
                console.log(error);
                toast({description:'Failed to fetch room details'});
            }
        }

        fetchroomDetails();
    }, [roomCode]);

    if (!room) {
        return (
            <div
                className="h-screen flex items-center justify-center text-white text-xl font-semibold"
                style={{
                    width: `${width}%`,
                    background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                }}
            >
                Loading room data...
            </div>
        );
    }

    return (
        <div
            className="h-screen p-6 overflow-y-auto text-white"
            style={{
                width: `${width}%`,
                background: "linear-gradient(to bottom right, #4e54c8, #8f94fb)",
            }}
        >
            <h2 className="text-2xl font-extrabold mb-2 border-b border-white pb-2">
                Room Code: <span className="text-yellow-300">{room.roomCode}</span>
            </h2>
            <h3 className="text-xl font-semibold mb-6">
                Host: <span className="text-green-200">{room.users.find(user => user.isHost)?.username || "Unknown"}</span>
            </h3>

            <div className="space-y-4">
                {room.users.map((user) => (
                    <div
                        key={user._id}
                        className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                            <p className="text-lg font-semibold text-white">{user.username}</p>
                            <p className="text-sm text-purple-100">
                                {user.isHost ? "👑 Host" : "🎮 Player"} | ⭐ Score: {user.score}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
