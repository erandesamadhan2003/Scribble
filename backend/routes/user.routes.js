import express from 'express'
import { createUser, deleteUser, updateUserScore } from '../controller/User.controller.js';

export const playerRoutes = express.Router();

playerRoutes.post('/create', createUser);
playerRoutes.delete('/delete/:playerId', deleteUser);
playerRoutes.put('/update/:id', updateUserScore);