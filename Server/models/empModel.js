const mongoose = require("mongoose");

const empSchema= new mongoose.Schema({
    name:String,
    email:String,
    designation:String,
    password:String
})

module.exports = mongoose.model("employee", empSchema);