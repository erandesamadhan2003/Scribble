import { useState, useEffect } from "react";

export const PlayGame = () => {
    const [hover, setHover] = useState(false);
    const [joinHover, setJoinHover] = useState(false);
    const [createHover, setCreateHover] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [avatarSeed, setAvatarSeed] = useState("player");

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

                {/* Game Buttons */}
                <div className="flex w-full mb-4 space-x-4">
                    <button
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 ${joinHover
                                ? "bg-emerald-700 text-white shadow-lg transform scale-105"
                                : "bg-emerald-500 text-white shadow-md"
                            }`}
                        onMouseEnter={() => setJoinHover(true)}
                        onMouseLeave={() => setJoinHover(false)}
                    >
                        JOIN ROOM
                    </button>

                    <button
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 ${createHover
                                ? "bg-blue-700 text-white shadow-lg transform scale-105"
                                : "bg-blue-500 text-white shadow-md"
                            }`}
                        onMouseEnter={() => setCreateHover(true)}
                        onMouseLeave={() => setCreateHover(false)}
                    >
                        CREATE ROOM
                    </button>
                </div>

                <div className="w-full mt-4">
                    <button
                        className={`w-full px-8 py-3 rounded-full font-bold transition-all duration-300 ${hover
                                ? "bg-purple-700 text-white shadow-lg transform scale-105"
                                : "bg-purple-500 text-white shadow-md"
                            }`}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        START PLAYING NOW
                    </button>
                </div>
            </div>
        </div>
    );
};
