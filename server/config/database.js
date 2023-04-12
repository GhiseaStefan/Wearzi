const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database successfully');
    } catch (err) {
        console.warn(err);
    }
};

module.exports = connect;