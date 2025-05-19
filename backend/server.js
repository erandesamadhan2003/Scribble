import express from 'express'
import dotenv from 'dotenv';
import { createServer } from 'http';
import { connectToDatabase } from './config/db.js';
import { playerRoutes } from './routes/user.routes.js';
import roomRoutes from './routes/room.routes.js';
import cors from 'cors';
dotenv.config();

const app = express();
const server = createServer(app);

connectToDatabase();


const corsOption = {
  origin: `http://localhost:5173`,  
};

app.use(cors(corsOption));
app.use(express.json());
app.use('/api/player', playerRoutes);
app.use('/api/room', roomRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is Running on the port ${PORT}`);
})

