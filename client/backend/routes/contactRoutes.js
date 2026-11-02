
const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public: Save contact form submission
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required",
            });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Contact message saved successfully",
            contact,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to save contact message",
        });
    }
});

// Admin: Get all contact messages
router.get("/messages", authMiddleware, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            total: messages.length,
            unread: messages.filter((item) => !item.isRead).length,
            messages,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
});

// Admin: Mark message as read or unread
router.patch("/messages/:id/read", authMiddleware, async (req, res) => {
    try {
        const { isRead } = req.body;

        if (typeof isRead !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isRead must be true or false",
            });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead },
            { new: true, runValidators: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        res.json({
            success: true,
            message: isRead ? "Marked as read" : "Marked as unread",
            contact: message,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to update message",
        });
    }
});

// Admin: Delete a contact message
router.delete("/messages/:id", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await Contact.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        res.json({
            success: true,
            message: "Contact message deleted successfully",
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
        });
    }
});

module.exports = router;
