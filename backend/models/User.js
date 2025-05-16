import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 },
    isHost: { type: Boolean, default: false },
},{ timestamps: true });

export default mongoose.model('User', userSchema);
