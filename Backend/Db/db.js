const mongoose = require('mongoose');

const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to database successfully");
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit the process on failure
    }
}

module.exports = connectToDb;