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
    },
    zi_nastere: {
        type: String,
        validate: {
            validator: (v) => {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} nu este o data valida (format: YYYY-MM-DD)!`
        }
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