const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error()
        }



        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Please authenticate'
        })
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id })
        if (!req.user.is_admin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required'
            })
        }
        req.user = user;
        req.token = token;
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error while checking admin status'
        })
    }
}

module.exports = {
    auth,
    isAdmin
}