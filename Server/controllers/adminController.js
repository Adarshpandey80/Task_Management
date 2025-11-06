const adminModel = require("../models/adminModel");
const empModel = require("../models/empModel");
const EmpPass = require("../utils/userPassword");
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





module.exports = {
    adminLogin,
    createUser

};