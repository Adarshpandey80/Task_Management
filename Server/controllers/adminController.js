const adminModel = require("../models/adminModel");
const empModel = require("../models/empModel");
const EmpPass = require("../utils/userPassword");

const adminLogin =  async (req , res) => {
       const {email , password} = req.body;
    try {
      
        const admin = await adminModel.findOne({email : email , password : password});
        if(!admin){
            res.status(401).send({msg: "Invalid Admin Email "})
        } 
        if(admin.password != password){
            res.status(401).send({msg: "Invalid Admin Password "})
        }
        res.status(200).send({msg: "Admin Login Successful" , admin : admin});

    } catch (error) {
         console.log("Error in Admin Login:", error);
    }
   
}

const createUser = async (req, res) => {
    const { name, email, role } = req.body;
    console.log(req.body);
    const userPassword = EmpPass.UserPassword();
    console.log(userPassword);
    try {
        const newUser = new empModel({
            name: name,
            email: email,
            designation: role,
            password: userPassword
        });
        await newUser.save();
        res.status(201).send({ msg: "User Created Successfully", user: newUser });
    } catch (error) {
        res.status(500).send({ msg: "Error in creating user", error: error.message });
    }
}





module.exports = {
    adminLogin , 
    createUser 

};