import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const PlayGame = () => {
    const [playerName, setPlayerName] = useState("");
    const [avatarSeed, setAvatarSeed] = useState("player");
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState();


    const createUser = async (host) => {
        try {
            const response = await fetch("http://localhost:3000/api/player/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: playerName,
                    isHost: host,
                    avatar: `https://api.dicebear.com/6.x/bottts/svg?seed=${avatarSeed}`
                })
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast({ description: data.message });
                return data.user; 
            }
        } catch (error) {
            console.log(error);
            toast({ description: "Failed to create user." });
            return null;
        }
    };


    const handleCreateRoom = async () => {
        const createdUser = await createUser(true); 
        if (!createdUser) return;

        try {
            const response = await fetch("http://localhost:3000/api/room/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hostId: createdUser._id, 
                    roomCode
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("room", JSON.stringify(data.room));
                navigate(`/sketchNsnort/${data.room.roomCode}`);
            }
        } catch (error) {
            console.log(error);
            toast({ description: "Failed to create room." });
        }
    };


    const handleJoinRoom = async () => {
        const createdUser = await createUser(false);

        try {
            const response = await fetch(`http://localhost:3000/api/room/join/${roomCode}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: createdUser._id })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("room", JSON.stringify(data.room));
                toast({ description: data.message });
                navigate(`/sketchNsnort/${data.room.roomCode}`);
            }
        } catch (error) {
            console.log(error);
            toast({ description: "Failed to join room." });
        }
    };


    useEffect(() => {
        setAvatarSeed(playerName ? playerName : "player");
    }, [playerName]);

    return (
        <div className="flex flex-col h-full p-6 m-4 bg-white rounded-lg shadow-lg bg-opacity-90 w-96">
            <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-purple-600">Play Game</h2>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow text-gray-700">
                <div className="mb-4 text-center">
                    <p className="mb-2 font-medium text-purple-600">Your Avatar</p>
                    <div className="flex justify-center">
                        <div className="p-1 bg-purple-100 rounded-full ring-2 ring-purple-500">
                            <img
                                src={`https://api.dicebear.com/6.x/bottts/svg?seed=${avatarSeed}`}
                                alt="Player Avatar"
                                className="w-20 h-20 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full mb-6">
                    <label className="block mb-2 text-sm font-medium text-purple-600">
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="flex justify-around w-full mb-4 space-x-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button variant="outline"
                                className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 
                            hover:bg-emerald-700 hover:text-white hover:shadow-lg hover:transform hover:scale-105
                            bg-emerald-500 text-white shadow-md
                            `}
                            >
                                JOIN ROOM
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Enter RoomCode
                            </DialogTitle>
                            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Enter Room Code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleJoinRoom}
                                className={`py-2 rounded-lg font-bold transition-all duration-300 
                                hover:bg-emerald-700 hover:text-white hover:shadow-lg hover:transform hover:scale-105
                                bg-emerald-500 text-white shadow-md
                            `}>JOIN Room</button>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button variant="outline"
                                className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300
                                hover:bg-blue-700 hover:text-white hover:shadow-lg hover:transform hover:scale-105
                                bg-blue-500 text-white shadow-md
                            `}
                            >
                                CREATE ROOM
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                Enter RoomCode
                            </DialogTitle>
                            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} placeholder="Enter Room Code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                className={`py-2 rounded-lg font-bold transition-all duration-300 
                                    hover:bg-emerald-700 hover:text-white hover:shadow-lg hover:transform hover:scale-105
                                    bg-emerald-500 text-white shadow-md`}
                                onClick={handleCreateRoom}
                            >Create Room</button>
                        </DialogContent>
                    </Dialog>


                </div>

                {/* <div className="w-full mt-4">
                    <button
                        className={`w-full px-8 py-3 rounded-full font-bold transition-all duration-300 
                                hover:bg-purple-700 hover:text-white hover:shadow-lg hover:transform hover:scale-105
                                bg-purple-500 text-white shadow-md
                            `}
                    >
                        START PLAYING NOW
                    </button>
                </div> */}
            </div>
        </div>
    );
};
