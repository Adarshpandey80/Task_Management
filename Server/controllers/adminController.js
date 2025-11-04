const adminModel = require("../models/adminModel");


const adminLogin =  async (req , res) => {
    const {email , password} = req.body;
    console.log(req.body);
    res.send("Login Successful");
}

module.exports = {
    adminLogin , 

};