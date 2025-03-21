const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    terms: {
        type: Boolean,
        required: true,
        default: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    news: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true
    },
    date_of_birth: {
        type: Date,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    wishlist: [{
        watch_id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            ref: 'Watch',
        }
    }],
},
{
    timestamps: true
});


UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
}

module.exports = mongoose.model('User', UserSchema);
