const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateEmail, validatePhoneNumber, validatePostalCode } = require('./utils');

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

const modifyUser = async (req, res) => {
    try {
        const { email, nume, prenume, telefon, zi_nastere, judet, oras, strada, nr_adresa, cod_postal, old_password, new_password } = req.body;
        const errors = {};
        if (!email) {
            return res.status(400).json({ message: 'Email-ul este necesar pentru a modifica datele' })
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'User-ul nu a fost gasit' })
        }

        const fields = [
            { key: 'nume', value: nume },
            { key: 'prenume', value: prenume },
            { key: 'telefon', value: telefon, validate: validatePhoneNumber, errorMessage: 'Numarul de telefon nu este valid' },
            { key: 'zi_nastere', value: zi_nastere },
            { key: 'judet', value: judet },
            { key: 'oras', value: oras },
            { key: 'strada', value: strada },
            { key: 'nr_adresa', value: nr_adresa },
            { key: 'cod_postal', value: cod_postal, validate: validatePostalCode, errorMessage: 'Codul postal nu are un format valid' },
        ];

        for (const field of fields) {
            if (field.value && field.value !== "") {
                if (field.validate && !field.validate(field.value)) {
                    errors[field.key] = field.errorMessage;
                } else {
                    user[field.key] = field.value;
                }
            }
        }

        if (new_password && new_password !== "") {
            if (new_password.length < 8 || !(/[A-Z]/.test(new_password)) || !(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(new_password))) {
                errors.new_password = 'Parola trebuie să conțină 8 caractere, 1 literă mare și 1 caracter special';
            }
            if (!(await bcrypt.compare(old_password, user.password))) {
                errors.old_password = 'Parola actuala este incorecta';
            } else {
                const encryptedPassword = await bcrypt.hash(new_password, 10);
                user.password = encryptedPassword;
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        await user.save();

        return res.status(200).json({ message: 'User-ul a fost modificat cu success' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when modifying user data' });
    }
};

module.exports = { registerUser, loginUser, authUser, logoutUser, modifyUser };