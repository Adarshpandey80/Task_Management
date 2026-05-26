const adminModel = require("../models/adminModel");
const empModel = require("../models/empModel");
const EmpPass = require("../utils/userPassword");
const emptaskModel = require("../models/empTaskModel")
const notificationModel = require("../models/notificationModel");
const nodemailer = require('nodemailer');

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {

        const admin = await adminModel.findOne({ email: email, password: password });
        if (!admin) {
            res.status(401).send({ msg: "Invalid Admin Email " })
        }
        if (admin.password != password) {
            res.status(401).send({ msg: "Invalid Admin Password " })
        }
        res.status(200).send({ msg: "Admin Login Successful", admin: admin });

    } catch (error) {
        console.log("Error in Admin Login:", error);
    }

}

const createUser = async (req, res) => {
    const { name, email, role } = req.body;
    const userPassword = EmpPass.UserPassword();

    try {
        const newUser = new empModel({
            name: name,
            email: email,
            designation: role,
            password: userPassword
        });
        await newUser.save();

        // Send email after user is created
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pandeyadarsh9628@gmail.com',
                pass: 'gfxu veqd gyif bnwm'
            }
        });

        const mailOptions = {
            from: 'pandeyadarsh9628@gmail.com',
            to: email,
            subject: "Employee Task Management Password",
            text: `Welcome ${name}! \n Your Task Management Password is : ${userPassword}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error occurred:", error);
                // Email failed, but user is created, log it
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).send({ msg: "User Created Successfully", user: newUser });
    } catch (error) {
        res.status(500).send({ msg: "Error in creating user", error: error.message });
    }
}

const empDataList = async (req, res) => {
    try {
        const empdata = await empModel.find()
        res.status(200).send(empdata)
    } catch (error) {
        console.log("error in emp data fatching", error)
    }

}

const assignTask = async (req, res) => {
    // const { title, description, duration, priority, empid } = req.body;

try {
    // const emptask = new emptaskModel({
    //     title : title ,
    //     description:description,
    //     duration:duration,
    //     priority:priority,
    //     empid : empid
    // })
     const emptask = new emptaskModel(req.body)
    await emptask.save()
    res.status(200).send("assign task succesfully")
} catch (error) {
    console.log("error in assign task", error)
}

}

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await emptaskModel.find()
        if (!tasks) {
            return res.status(404).send({ msg: "No tasks found" })
        }
        res.status(200).send(tasks)
    } catch (error) {
        console.log("Error in get all tasks:", error)
        res.status(500).send({ msg: "Error fetching tasks", error: error.message })
    }
}

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!status) {
            return res.status(400).send({ msg: "Status is required" })
        }

        const validStatuses = ['Pending', 'In Progress', 'Completed', 'On Hold']
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ msg: "Invalid status value" })
        }

        const task = await emptaskModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        )

        if (!task) {
            return res.status(404).send({ msg: "Task not found" })
        }

        res.status(200).send({ msg: "Task status updated successfully", task: task })
    } catch (error) {
        console.log("Error in update task status:", error)
        res.status(500).send({ msg: "Error updating task status", error: error.message })
    }
}

const seeReport = async (req,res) =>{
    try {
        // Return ALL tasks, not just completed ones
        const report = await emptaskModel.find()
        res.send(report);
    } catch (error) {
        console.log("Error in see report:", error)
        res.status(500).send({ msg: "Error fetching reports", error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await empModel.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).send({ msg: "User not found" })
        }
        res.status(200).send({ msg: "User deleted successfully", user: result })
    } catch (error) {
        console.log("Error in delete user:", error)
        res.status(500).send({ msg: "Error deleting user", error: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await empModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!result) {
            return res.status(404).send({ msg: "User not found" })
        }
        res.status(200).send({ msg: "User updated successfully", user: result })
    } catch (error) {
        console.log("Error in update user:", error)
        res.status(500).send({ msg: "Error updating user", error: error.message })
    }
}

// Get report details with employee information
const getReportDetail = async (req, res) => {
    try {
        const { id } = req.params
        const report = await emptaskModel.findById(id)
        
        if (!report) {
            return res.status(404).send({ msg: "Report not found" })
        }

        // Get employee details
        const employee = await empModel.findById(report.empid)
        
        res.status(200).send({
            msg: "Report details fetched",
            report: report,
            employee: employee
        })
    } catch (error) {
        console.log("Error in get report detail:", error)
        res.status(500).send({ msg: "Error fetching report details", error: error.message })
    }
}

// Admin reply to employee report
const replyToReport = async (req, res) => {
    try {
        const { taskId } = req.params
        const { message } = req.body

        if (!message || message.trim() === "") {
            return res.status(400).send({ msg: "Reply message is required" })
        }

        // Update task with admin reply
        const task = await emptaskModel.findByIdAndUpdate(
            taskId,
            {
                adminReply: {
                    message: message,
                    sentAt: new Date(),
                    isRead: false
                }
            },
            { new: true }
        )

        if (!task) {
            return res.status(404).send({ msg: "Task not found" })
        }

        // Check if notification already exists for this task
        let notification = await notificationModel.findOne({ taskId: taskId })

        if (notification) {
            // Notification exists - add admin's reply to replies array
            notification = await notificationModel.findByIdAndUpdate(
                notification._id,
                {
                    $push: {
                        replies: {
                            sender: 'admin',
                            message: message,
                            senderName: 'Admin',
                            sentAt: new Date()
                        }
                    },
                    // Update the main message to the latest admin message
                    message: message,
                    isRead: false
                },
                { new: true }
            )
        } else {
            // No notification exists - create a new one with the initial admin message
            notification = new notificationModel({
                empid: task.empid,
                empName: task.empName,
                empEmail: task.empEmail,
                taskId: task._id,
                taskTitle: task.title,
                notificationType: 'ADMIN_REPLY',
                title: `Admin replied on: ${task.title}`,
                message: message,
                isRead: false,
                relatedData: {
                    adminMessage: message,
                    taskStatus: task.status
                }
            })
            await notification.save()
        }

        res.status(200).send({
            msg: "Reply sent successfully",
            task: task,
            notification: notification
        })
    } catch (error) {
        console.log("Error in reply to report:", error)
        res.status(500).send({ msg: "Error sending reply", error: error.message })
    }
}

// Get notification by task ID (to see employee replies)
const getTaskNotification = async (req, res) => {
    try {
        const { taskId } = req.params
        
        const notification = await notificationModel.findOne({ taskId: taskId })

        if (!notification) {
            return res.status(200).send({ msg: "No notification found", notification: null })
        }

        res.status(200).send(notification)
    } catch (error) {
        console.log("Error in get task notification:", error)
        res.status(500).send({ msg: "Error fetching notification", error: error.message })
    }
}

module.exports = {
    adminLogin,
    createUser,
    empDataList,
    assignTask,
    getAllTasks,
    updateTaskStatus,
    getReportDetail,
    replyToReport,
    getTaskNotification,
    seeReport,
    deleteUser,
    updateUser
};