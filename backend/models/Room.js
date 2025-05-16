import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomCode: {type: String, required: true, unique: true},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
},{ timestamps: true });

export default mongoose.model('Room', roomSchema);
