const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        match: [/\S+@\S+\.\S+/, 'Email jest nieprawidłowy'] 
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    notes: [
        {
            title:{
                type:String,
            },
            body: {
                type:String,
            },
            creationDate:{
                type: Date,
                default: Date.now
            }
        }
    ],
});


module.exports = mongoose.model('User', userSchema)
