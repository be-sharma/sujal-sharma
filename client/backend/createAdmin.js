
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const name = "Sujal";
        const email = "sujals7812@gmail.com";
        const password = "SujalSHARMA@6388";

        const existingAdmin = await Admin.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 12);

        if (existingAdmin) {
            existingAdmin.name = name;
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();

            console.log("Admin password updated successfully!");
        } else {
            await Admin.create({
                name,
                email,
                password: hashedPassword,
            });

            console.log("Admin created successfully!");
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
