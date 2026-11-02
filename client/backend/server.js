const contactRoutes = require("./routes/contactRoutes");
const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Portfolio backend is running successfully!",
    });
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
