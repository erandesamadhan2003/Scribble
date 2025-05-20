import { Server } from "socket.io";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ["GET", "POST", "PUT"]
        }
    });

    const roomLines = {}; 

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        
        socket.on("joinRoom", (roomCode) => { 
            socket.join(roomCode);
            console.log(`User ${socket.id} joined room: ${roomCode}`);

            
            if (roomLines[roomCode]) {
                roomLines[roomCode].forEach(line => {
                    socket.emit("drawing", line); 
                });
            } else {
                roomLines[roomCode] = []; 
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
        
        socket.on("drawing", (data) => {
            const { roomCode, isDrawing, newPoints } = data; 
            if (isDrawing && roomLines[roomCode] && roomLines[roomCode].length > 0) {
                const lastLineIndex = roomLines[roomCode].length - 1;
                const lastLine = roomLines[roomCode][lastLineIndex];
                lastLine.points = newPoints;
                socket.to(roomCode).emit("drawingUpdate", { index: lastLineIndex, newPoints });
            }
        });
        socket.on("stopDrawing", (data) => {
            const { roomCode } = data; 
        });
        // Handle undo event
        socket.on("undo", (updatedLines, roomCode) => { 
            roomLines[roomCode] = updatedLines;
            socket.to(roomCode).emit("undo", updatedLines); 
        });
        
        socket.on("redo", (updatedLines, roomCode) => { 
            roomLines[roomCode] = updatedLines; 
            socket.to(roomCode).emit("redo", updatedLines); 
        });
        // Handle clear event
        socket.on("clear", (roomCode) => {
            roomLines[roomCode] = []; 
            socket.to(roomCode).emit("clear"); 
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};