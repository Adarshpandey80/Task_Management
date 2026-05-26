const empModel = require("../models/empModel")
const empTask = require("../models/empTaskModel")
const notificationModel = require("../models/notificationModel")





const emptask = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await empModel.findOne({ email: email });

        if (!employee) {
            res.status(401).send({ msg: "Invalid Employee Email!" });
        }

        if (employee.password != password) {
            res.status(401).send({ msg: "Invalid Employee Password!" });
        }
        res.status(200).send({ employee: employee, msg: "You are Successfully Login!" });
    } catch (error) {
         console.log("error in employee login " , error)
    }
}

const showTask = async ( req,res) =>{
    const {id} = req.params;
    try {
        const task = await empTask.find({empid:id})
        res.send(task)
    } catch (error) {
         console.log("error in fetch task data" , error)
    }
}


const sendReport = async (req,res)=>{
    try {
         const {tid , status , completionday , comment, empName, empEmail} = req.body
    console.log(req.body);
     const updatedTask = await empTask.findByIdAndUpdate(tid , {
         status: status,
         completionday: completionday,
         comment: comment,
         reportSentAt: new Date(),
         empName: empName,
         empEmail: empEmail
     }, { new: true })

    res.status(201).send({ msg: "Report sent successfully", task: updatedTask })
    } catch (error) {
         console.log("error in report sending", error)
         res.status(401).send({ msg: "error in report sending", error: error.message })
    }
}

// Get all notifications for an employee
const getNotifications = async (req, res) => {
    try {
        const { empid } = req.params
        
        const notifications = await notificationModel.find({ empid: empid })
            .sort({ createdAt: -1 })
            .limit(50)

        res.status(200).send(notifications)
    } catch (error) {
        console.log("Error in get notifications:", error)
        res.status(500).send({ msg: "Error fetching notifications", error: error.message })
    }
}

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params
        
        const notification = await notificationModel.findByIdAndUpdate(
            notificationId,
            { isRead: true, readAt: new Date() },
            { new: true }
        )

        if (!notification) {
            return res.status(404).send({ msg: "Notification not found" })
        }

        res.status(200).send({ msg: "Notification marked as read", notification: notification })
    } catch (error) {
        console.log("Error in mark notification as read:", error)
        res.status(500).send({ msg: "Error updating notification", error: error.message })
    }
}

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const { empid } = req.params
        
        const unreadCount = await notificationModel.countDocuments({
            empid: empid,
            isRead: false
        })

        res.status(200).send({ unreadCount: unreadCount })
    } catch (error) {
        console.log("Error in get unread count:", error)
        res.status(500).send({ msg: "Error fetching unread count", error: error.message })
    }
}

// Employee reply to admin notification
const replyToNotification = async (req, res) => {
    try {
        const { notificationId } = req.params
        const { message, empName, empEmail } = req.body

        if (!message || message.trim() === "") {
            return res.status(400).send({ msg: "Reply message is required" })
        }

        const notification = await notificationModel.findByIdAndUpdate(
            notificationId,
            {
                $push: {
                    replies: {
                        sender: 'employee',
                        message: message,
                        senderName: empName,
                        sentAt: new Date()
                    }
                }
            },
            { new: true }
        )

        if (!notification) {
            return res.status(404).send({ msg: "Notification not found" })
        }

        res.status(200).send({ 
            msg: "Reply sent successfully", 
            notification: notification 
        })
    } catch (error) {
        console.log("Error in reply to notification:", error)
        res.status(500).send({ msg: "Error sending reply", error: error.message })
    }
}


module.exports = {
    emptask,
    showTask,
    sendReport,
    getNotifications,
    markNotificationAsRead,
    getUnreadCount,
    replyToNotification
}