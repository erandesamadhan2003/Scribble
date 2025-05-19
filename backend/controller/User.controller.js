import Room from "../models/Room.js";
import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
        const { username, isHost, avatar } = req.body;
        if (!username || !avatar) {
            return res.status(400).json({
                success: false,
                message: 'All Fields are required'
            })
        }

        const user = new User({ username, isHost, avatar });
        await user.save();

        res.status(200).json({
            success: true,
            message: `welcome ${username}`,
            user
        })
    } catch (error) {
        console.log('Error in createing player: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error in creating Player'
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { playerId  } = req.params;

        if (!playerId) {
            return res.status(400).json({
                success: false,
                message: 'Player id required'
            })
        }

        const user = await User.findById(playerId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Player not found'
            });
        }

        await Room.updateMany(
            { users: playerId },
            { $pull: { users: playerId } }
        );

        await User.findByIdAndDelete(playerId);
        return res.status(200).json({
            success: true,
            message: 'Player deleted successfully'
        });
    } catch (error) {
        console.log('Error in deleting player: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error in deleting player'
        });
    }
}

export const updateUserScore = async (req, res) => {
    const { score } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'PlayerId is required'
        });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { $inc: { score: score } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Player not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Score updated successfully',
            user
        });
    } catch (error) {
        console.log('Error updating user score: ', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating user score'
        });
    }
}