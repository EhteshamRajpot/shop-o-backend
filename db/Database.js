const mongoose = require("mongoose")

const connectDatabase = async () => {
    const url = process.env.MONGODB_URL
    try {
        await mongoose.connect(url).then(() => {
            console.log(`Database connected successfully`)
        })
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process on connection failure
    }
} 

module.exports = connectDatabase;