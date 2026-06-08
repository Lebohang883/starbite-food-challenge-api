const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim:true
    },
    points: {
        type: Number,
        required: [true, 'Points are required'],
        default: 10
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealSuggestion: {
        type: String,
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model('Challenge', challengeSchema);