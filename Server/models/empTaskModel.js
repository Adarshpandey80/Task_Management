const mongoose = require("mongoose");

const taskSchema= new mongoose.Schema({
    title:String,
    description:String,
     duration: Number,
    priority:String,
    empid : String,
    status:String,
    completionday:Number,
    comment:String,    
    tasksend: Boolean
})

module.exports = mongoose.model("emptask",taskSchema);