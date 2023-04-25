const mongoose = require('mongoose')

const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    nume: {
        type: String,
        required: true,
    },
    prenume: {
        type: String,
        required: true,
    },
    telefon: {
        type: String,
        validate: {
            validator: (v) => {
                return /^[0-9]+$/.test(v);
            },
            message: props => `${props.value} nu e un numar de telefon valid!`
        }
    },
    zi_nastere: {
        type: Date,
    },
    judet: {
        type: String,
    },
    oras: {
        type: String,
    },
    strada: {
        type: String,
    },
    nr_adresa: {
        type: String,
    },
    cod_postal: {
        type: String,
    }
});

module.exports = mongoose.model('User', User);