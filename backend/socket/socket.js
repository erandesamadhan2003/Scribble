import { Server } from "socket.io";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT"]
        }
    });

    const roomLines = {};
    const roomMessages = {};
    const roomUsers = {};

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinRoom", (roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} joined room: ${roomCode}`)

            if (roomLines[roomCode]) {
                socket.emit("syncDrawing", roomLines[roomCode]);
            } else {
                roomLines[roomCode] = [];
            }


            if (roomMessages[roomCode]) {
                socket.emit("syncMessages", roomMessages[roomCode]);
            } else {
                roomMessages[roomCode] = [];
            }
        });

        socket.on("startDrawing", (data) => {
            const { roomCode, ...lineData } = data;
            if (!roomLines[roomCode]) {
                roomLines[roomCode] = [];
            }
            roomLines[roomCode].push(lineData);
            socket.to(roomCode).emit("drawing", lineData);
        });
        socket.on("setSketcher", ({ roomCode, sketcher }) => {
            console.log(`New sketcher in ${roomCode}: ${sketcher}`);
            io.to(roomCode).emit("updateSketcher", sketcher);
        });

        socket.on("drawing", (data) => {
            const { roomCode, isDrawing, newPoints } = data;
            if (isDrawing && roomLines[roomCode] && roomLines[roomCode].length > 0) {
                const lastLineIndex = roomLines[roomCode].length - 1;
                const lastLine = roomLines[roomCode][lastLineIndex];
                lastLine.points = newPoints;
                socket.to(roomCode).emit("drawing", lastLine);
            }
        });

        socket.on("stopDrawing", (data) => {
            const { roomCode } = data;
        });

        socket.on("undo", (updatedLines, roomCode) => {
            roomLines[roomCode] = updatedLines;
            socket.to(roomCode).emit("undo", updatedLines);
        });

        socket.on("redo", (updatedLines, roomCode) => {
            roomLines[roomCode] = updatedLines;
            socket.to(roomCode).emit("redo", updatedLines);
        });

        socket.on("clear", (roomCode) => {
            roomLines[roomCode] = [];
            socket.to(roomCode).emit("clear");
        });

        socket.on("chatMessage", (message) => {
            const { roomCode } = message;
            if (!roomMessages[roomCode]) {
                roomMessages[roomCode] = [];
            }
            roomMessages[roomCode].push(message);
            io.to(roomCode).emit("chatMessage", message);
        });


        //Playerlist Socket connection  
        socket.on("playerJoined", (username, roomCode) => {
            if (!roomUsers[roomCode]) roomUsers[roomCode] = [];

            const alreadyExists = roomUsers[roomCode].some(user => user.username === username);
            if (!alreadyExists) {
                roomUsers[roomCode].push({
                    username,
                    isHost: roomUsers[roomCode].length === 0,
                    score: 0,
                    avatar: `https://api.dicebear.com/6.x/bottts/svg?seed=${username}`
                });
            }

            io.to(roomCode).emit("updatePlayerList", roomUsers[roomCode]);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};