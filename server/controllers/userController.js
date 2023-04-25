const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const registerUser = async (req, res) => {
    try {
        const { email, password, nume, prenume } = req.body;
        if (email.length === 0) {
            return res.status(400).json({ message: 'You need to add an email' })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'This email is not a valid format' })
        }
        const oldUser = await User.findOne({ 'email': email })
        if (oldUser) {
            return res.status(400).json({ message: 'Email is already used' })
        }
        if (nume.length === 0) {
            return res.status(400).json({ message: 'You need to add a nume' })
        }
        if (prenume.length === 0) {
            return res.status(400).json({ message: 'You need to add a prenume' })
        }
        if (password.length === 0) {
            return res.status(400).json({ message: 'You need to add a password' })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must contain 8 characters' })
        }
        if (!(/[A-Z]/.test(password))) {
            return res.status(400).json({ message: 'Password must contain 1 uppercase character' })
        }
        if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))) {
            return res.status(400).json({ message: 'Password must contain 1 special character' })
        }
        encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email: email.toLowerCase(), password: encryptedPassword, nume: nume, prenume: prenume })
        const payload = {
            _id: newUser._id,
            email: newUser.email.toLowerCase()
        }
        const options = { expiresIn: '1h' }
        const token = jwt.sign(payload, process.env.SECRET_KEY, options)
        return res.cookie('auth-token', token, { httpOnly: true, sameSite: 'strict' }).status(201).json({ message: 'Registration complete!' });
    } catch (err) {
        console.warn(err)
        return res.status(500).json({ message: 'Server error when creating user' })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email.length === 0) {
            return res.status(400).json({ message: 'You need to add an email' })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'This email is not a valid format' })
        }
        const user = await User.findOne({ 'email': email.toLowerCase() })
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exist" })
        }
        if (password.length === 0) {
            return res.status(400).json({ message: 'You need to add a password' })
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Incorrect password' })
        }
        const payload = {
            _id: user._id,
            email: user.email.toLowerCase()
        }
        const options = { expiresIn: '1h' }
        const token = jwt.sign(payload, process.env.SECRET_KEY, options)
        return res.cookie('auth-token', token, { httpOnly: true, sameSite: 'strict' }).status(200).json({ message: 'Logged in successfully!' });
    } catch (err) {
        console.warn(err)
        return res.status(500).json({ message: 'Server error when logging user' })
    }
}

const authUser = async (req, res) => {
    try {
        const token = req.cookies['auth-token'];

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decodedToken._id;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'You are logged in!', user: user });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('auth-token');
    return res.status(200).json({ message: 'Logged out successfully!' });
}

module.exports = { registerUser, loginUser, authUser, logoutUser };