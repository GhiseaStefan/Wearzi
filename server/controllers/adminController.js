require('dotenv').config();
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username !== 'admin') {
            return res.status(400).json({ message: 'Username incorect' });
        }
        if (password !== 'adminPassword') {
            return res.status(400).json({ message: 'Parola incorecta' });
        }
        const payload = { username };
        const options = { expiresIn: '12h' };
        const token = jwt.sign(payload, process.env.SECRET_key, options);
        return res.cookie('admin-token', token, { httpOnly: true, sameSite: 'strict' }).status(200).json({ message: 'Logged in successfully!' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Eroare de server la logarea administratorului' })
    }
}

const logoutAdmin = async (req, res) => {
    res.clearCookie('admin-token');
    return res.status(200).json({ message: 'Logout admin realizat cu succes' });
}

const authAdmin = async (req, res) => {
    try {
        const token = req.cookies['admin-token'];

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const isAdmin = 'admin' === decodedToken.username;
        if (!isAdmin) {
            return res.status(404).json({ message: 'Username-ul nu a fost gasit' })
        }

        return res.status(200).json({ message: 'Te-ai logat cu succes' });
    } catch (err) {
        console.warn(err);
        return res.status(403).json({ message: 'Token invalid' });
    }
};

module.exports = { loginAdmin, logoutAdmin, authAdmin };


