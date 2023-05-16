require('dotenv').config();
const User = require('../models/userModel');
const { Product } = require('../models/productModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { validateEmail, validatePhoneNumber, validatePostalCode } = require('./utils');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort('_id');
        return res.status(200).json(users);
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when getting all users' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        return res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Server error when deleting user' });
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password, nume, prenume } = req.body;
        if (email.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi un email' })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Acest email nu are un format valid' })
        }
        const oldUser = await User.findOne({ 'email': email })
        if (oldUser) {
            return res.status(400).json({ message: 'Email-ul este deja folosit' })
        }
        if (nume.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi un nume' })
        }
        if (prenume.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi un prenume' })
        }
        if (password.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi o parola' })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Parola trebuie sa contina minim 8 caractere' })
        }
        if (!(/[A-Z]/.test(password))) {
            return res.status(400).json({ message: 'Parola trebuie sa contina un caracter majuscule' })
        }
        if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))) {
            return res.status(400).json({ message: 'Parola trebuie sa contina un caracter special' })
        }
        encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email: email.toLowerCase(), password: encryptedPassword, nume: nume, prenume: prenume })
        const payload = {
            _id: newUser._id,
            email: newUser.email.toLowerCase()
        }
        const options = { expiresIn: '1h' }
        const token = jwt.sign(payload, process.env.SECRET_KEY, options)
        return res.cookie('auth-token', token, { httpOnly: true, sameSite: 'strict' }).status(201).json({ message: 'Inregistrare completa!' });
    } catch (err) {
        console.warn(err)
        return res.status(500).json({ message: 'Eroare de server la creearea utilizatorului' })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email.length === 0) {
            return res.status(400).json({ message: 'Trebue sa adaugi un email' })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Acest email nu are un format valid' })
        }
        const user = await User.findOne({ 'email': email.toLowerCase() })
        if (!user) {
            return res.status(400).json({ message: "Email-ul nu exista" })
        }
        if (password.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi o parola' })
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Parola incorecta' })
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
        return res.status(500).json({ message: 'Eroare de server la logarea utilizatorului' })
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
            return res.status(404).json({ message: 'Utilizatorul nu a fost gasit' });
        }

        return res.status(200).json({ message: 'Te-ai logat cu succes', user: user });
    } catch (err) {
        return res.status(403).json({ message: 'Token invalid' });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('auth-token');
    return res.status(200).json({ message: 'Logout realizat cu succes' });
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
        return res.status(500).json({ message: 'Eroare de server la modificarea datelor utilizatorului' });
    }
};

const forgotPasswordUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'E-mailul nu a fost gasit' });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const msg = {
            to: user.email,
            from: 'clothingwearzi@gmail.com',
            subject: 'Resetare parola',
            text: `Pentru a reseta parola, acceseaza urmatorul link:\nhttp://localhost:3000/resetPassword/${token}`,
        };

        await sgMail.send(msg);
        return res.status(200).json({ message: 'E-mailul de resetare a parolei a fost trimis' });
    } catch (error) {
        return res.status(500).json({ message: 'A apărut o eroare.', err: error });
    }
}

const resetPasswordUser = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token invalid sau expirat' });
        }

        if (password.length === 0) {
            return res.status(400).json({ message: 'Trebuie sa adaugi o parola' })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Parola trebuie sa contina minim 8 caractere' })
        }
        if (!(/[A-Z]/.test(password))) {
            return res.status(400).json({ message: 'Parola trebuie sa contina un caracter majuscule' })
        }
        if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password))) {
            return res.status(400).json({ message: 'Parola trebuie sa contina un caracter special' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        const msg = {
            to: user.email,
            from: 'clothingwearzi@gmail.com',
            subject: 'Parola a fost resetata',
            text: 'Parola pentru contul tau a fost resetata cu succes.',
        };

        await sgMail.send(msg);
        return res.status(200).json({ message: 'Parola a fost resetată cu succes.' });
    } catch (error) {
        return res.status(500).json({ message: 'A apărut o eroare.' });
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { cartItems: Object.values(cartItems) },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: 'User-ul nu a fost gasit' });
        }

        return res.status(200).json({ message: 'Cosul de cumparaturi a fost actualizat cu success' });
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Eroare de server la modificarea cosului de cumparaturi' });
    }
};


const getCart = async (req, res) => {
    try {
        const { userId } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User-ul nu a fost gasit' })
        }

        const cartItemsBefore = user.cartItems;

        const cartItems = cartItemsBefore.reduce((acc, item) => {
            acc[item._id.toString()] = item;
            return acc;
        }, {});

        return res.status(200).json({ cartItems })
    } catch (err) {
        console.warn(err);
        return res.status(500).json({ message: 'Eroare de server la obtinerea cosului de cumparaturi' });
    }
}

const discountedPrice = (price, discount) => {
    return (price - price * discount).toFixed(2)
}

const sendOrder = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User-ul nu a fost gasit' })
        }

        const order_total = cartItems.reduce((total, item) => {
            const itemPrice = item.discount !== 0 ? discountedPrice(item.price, item.discount) : item.price;
            return total + itemPrice * item.quantity;
        }, 0);

        const newOrder = {
            order_number: user.orders.length + 1,
            order_date: new Date(),
            order_total: order_total,
            order_products: cartItems
        };

        user.orders.push(newOrder);

        for (const item of cartItems) {
            const product = await Product.findById(item._id);

            if (product) {
                product.quantity -= item.quantity;
                await product.save();
            } else {
                return res.status(404).json({ message: 'Produsul nu a fost gasit' });
            }
        }

        await user.save();

        return res.status(200).json({ message: 'Comanda a fost trimisa cu succes', order: newOrder });
    } catch (err) {
        return res.status(500).json({ message: 'A aparut o eroare la trimiterea comenzii', error: err.message });
    }
}

module.exports = { getUsers, deleteUser, registerUser, loginUser, authUser, logoutUser, modifyUser, forgotPasswordUser, resetPasswordUser, updateCart, getCart, sendOrder };