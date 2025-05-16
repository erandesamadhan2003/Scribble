import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: String,
  username: String,
  text: String,
  isCorrectGuess: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
