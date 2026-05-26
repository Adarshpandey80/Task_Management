const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: Number,
    priority: String,
    empid: String,
    empName: String,
    empEmail: String,
    status: String,
    completionday: Number,
    comment: String,
    tasksend: Boolean,
    reportSentAt: { type: Date, default: null },
    adminReply: {
        message: String,
        sentAt: { type: Date, default: null },
        isRead: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("emptask", taskSchema);