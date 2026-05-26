const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    empid: String,
    empName: String,
    empEmail: String,
    taskId: mongoose.Schema.Types.ObjectId,
    taskTitle: String,
    notificationType: {
        type: String,
        enum: ['ADMIN_REPLY', 'TASK_ASSIGNED', 'TASK_UPDATED'],
        default: 'ADMIN_REPLY'
    },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    relatedData: {
        adminMessage: String,
        taskStatus: String,
        previousStatus: String
    },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("notification", notificationSchema);
