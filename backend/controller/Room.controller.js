import Room from '../models/Room.js';
import User from '../models/User.js';

export const createRoom = async (req, res) => {
    try {
        const { hostId, roomCode } = req.body;

        if (!hostId || !roomCode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const hostUser = await User.findById(hostId);
        if (!hostUser) {
            return res.status(404).json({
                success: false,
                message: 'Host user not found'
            });
        }

        const room = new Room({
            roomCode,
            users: [hostId]
        });

        await room.save();

        const populatedRoom = await Room.findById(room._id).populate('users');

        return res.status(201).json({
            success: true,
            message: 'Room created successfully',
            room: populatedRoom
        });

    } catch (error) {
        console.log('Error creating room:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating room'
        });
    }
};

export const getRoomByCode = async (req, res) => {
    try {
        const { roomCode } = req.params;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: 'Room code is required'
            });
        }

        const room = await Room.findOne({ roomCode }).populate('users');

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        return res.status(200).json({
            success: true,
            room
        });

    } catch (error) {
        console.log('Error getting room:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting room'
        });
    }
};

export const addUserToRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;
        const { userId } = req.body;

        if (!roomCode || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Room code and user ID are required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const room = await Room.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (room.users.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'User is already in the room'
            });
        }

        room.users.push(userId);
        await room.save();

        const updatedRoom = await Room.findById(room._id).populate('users');

        return res.status(200).json({
            success: true,
            message: 'User added to room successfully',
            room: updatedRoom
        });

    } catch (error) {
        console.log('Error adding user to room:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding user to room'
        });
    }
};

export const removeUserFromRoom = async (req, res) => {
    try {
        const { roomCode, userId } = req.params;

        if (!roomCode || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Room code and user ID are required'
            });
        }

        const room = await Room.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        if (!room.users.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'User is not in the room'
            });
        }

        room.users = room.users.filter(id => id.toString() !== userId);
        
        if (room.users.length === 0) {
            await Room.findByIdAndDelete(room._id);
            return res.status(200).json({
                success: true,
                message: 'User removed and empty room deleted'
            });
        } else {
            await room.save();
            
            const updatedRoom = await Room.findById(room._id).populate('users');
            
            return res.status(200).json({
                success: true,
                message: 'User removed from room successfully',
                room: updatedRoom
            });
        }

    } catch (error) {
        console.log('Error removing user from room:', error);
        return res.status(500).json({
            success: false,
            message: 'Error removing user from room'
        });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: 'Room code is required'
            });
        }

        const deletedRoom = await Room.findOneAndDelete({ roomCode });
        
        if (!deletedRoom) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Room deleted successfully'
        });

    } catch (error) {
        console.log('Error deleting room:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting room'
        });
    }
};