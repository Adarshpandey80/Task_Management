const adminModel = require("../models/adminModel");


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

module.exports = {
    adminLogin , 

};