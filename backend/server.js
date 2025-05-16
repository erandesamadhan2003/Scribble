import express from 'express'
import dotenv from 'dotenv';
import { createServer } from 'http';
import { connectToDatabase } from './config/db.js';
dotenv.config();

const app = express();
const server = createServer(app);

connectToDatabase();

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is Running on the port ${PORT}`);
})

