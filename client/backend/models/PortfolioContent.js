const mongoose = require("mongoose");

const portfolioContentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "main",
            unique: true,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "PortfolioContent",
    portfolioContentSchema
);