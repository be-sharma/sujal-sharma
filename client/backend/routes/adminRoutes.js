
const express = require("express");
const Contact = require("../models/Contact");
const Admin = require("../models/Admin");
const PortfolioContent = require("../models/PortfolioContent");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from backend .env");
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login successful.",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to login. Check the backend configuration.",
        });
    }
});

// Dashboard statistics
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const [totalMessages, unreadMessages, readMessages, recentMessages] =
            await Promise.all([
                Contact.countDocuments(),
                Contact.countDocuments({ isRead: false }),
                Contact.countDocuments({ isRead: true }),
                Contact.find()
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .select("name email subject message isRead createdAt"),
            ]);

        res.json({
            success: true,
            admin: req.admin,
            stats: { totalMessages, unreadMessages, readMessages },
            recentMessages,
        });
    } catch (error) {
        console.error("Dashboard error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard data.",
        });
    }
});

// Get editable portfolio content
router.get("/content", authMiddleware, async (req, res) => {
    try {
        const record = await PortfolioContent.findOne({ key: "main" });

        res.json({
            success: true,
            content: record?.content || {
                heroRole: "Full-Stack Developer · Web Engineer",
                heroDescription:
                    "I turn ideas into beautiful, responsive web experiences.",
                about1:
                    "I'm a developer who enjoys turning ideas into complete digital experiences.",
                about2:
                    "I believe in thoughtful design, clean code and continuous learning.",
            },
        });
    } catch (error) {
        console.error("Read content error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to load portfolio content.",
        });
    }
});

// Save editable portfolio content

router.put("/content", authMiddleware, async (req, res) => {
    try {
        const { heroRole, heroDescription, about1, about2, projects } = req.body;

        const existing = await PortfolioContent.findOne({ key: "main" });
        const previous = existing?.content || {};

        const content = {
            ...previous,
            heroRole: String(heroRole ?? previous.heroRole ?? "").slice(0, 160),
            heroDescription: String(heroDescription ?? previous.heroDescription ?? "").slice(0, 2000),
            about1: String(about1 ?? previous.about1 ?? "").slice(0, 2000),
            about2: String(about2 ?? previous.about2 ?? "").slice(0, 2000),
        };

        if (Array.isArray(projects)) {
            content.projects = projects
                .slice(0, 100)
                .map((project) => ({
                    id: String(project.id || ""),
                    title: String(project.title || "").trim().slice(0, 120),
                    description: String(project.description || "").trim().slice(0, 2000),
                    image: String(project.image || "").trim().slice(0, 2000),
                    category: project.category === "design" ? "design" : "web",
                    type: String(project.type || "Web Project").slice(0, 100),
                    icon: String(project.icon || "✦").slice(0, 10),
                    theme: "custom",
                    tags: Array.isArray(project.tags)
                        ? project.tags.slice(0, 8).map((tag) => String(tag).slice(0, 40))
                        : [],
                    live: String(project.live || "#projects").slice(0, 2000),
                    repo: String(project.repo || "").slice(0, 2000),
                }))
                .filter((project) => project.id && project.title);
        }

        const record = await PortfolioContent.findOneAndUpdate(
            { key: "main" },
            { $set: { content } },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Portfolio content saved.",
            content: record.content,
        });
    } catch (error) {
        console.error("Save content error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to save portfolio content.",
        });
    }
});


// Public portfolio content — no login required
router.get("/public-content", async (req, res) => {
    try {
        const record = await PortfolioContent.findOne({ key: "main" });

        res.json({
            success: true,
            content: record?.content || null,
        });
    } catch (error) {
        console.error("Public content error:", error.message);
        res.status(500).json({
            success: false,
            message: "Unable to load portfolio content.",
        });
    }
});


module.exports = router;
