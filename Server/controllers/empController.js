const empModel = require("../models/empModel")
const empTask = require("../models/empTaskModel")





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



module.exports = {
    emptask,
    showTask
}