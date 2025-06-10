const mongoose = require('mongoose');

const connectToDb = async() => {
    try {
       const connectionDb = await mongoose.connect(process.env.ATLAS_DB_URL);
        console.log(`Mongo Connected DB Host ${connectionDb.connection.host}`);
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit the process on failure
    }
}

module.exports = connectToDb;