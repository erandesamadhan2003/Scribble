import express from 'express';
import { 
    createRoom, 
    getRoomByCode, 
    addUserToRoom, 
    removeUserFromRoom, 
    deleteRoom 
} from '../controller/Room.controller.js';

const roomRoutes = express.Router();

roomRoutes.post('/create', createRoom);
roomRoutes.get('/getRoom/:roomCode', getRoomByCode);
roomRoutes.put('/join/:roomCode', addUserToRoom);
roomRoutes.delete('/removePlayer/:roomCode/leave/:userId', removeUserFromRoom);
roomRoutes.delete('/delete/:roomCode', deleteRoom);

export default roomRoutes;