const express = require("express");
const router = express.Router();
const adminCortroller = require("../controllers/adminController");


router.post("/login" ,adminCortroller.adminLogin);
router.post("/createuser" , adminCortroller.createUser);



module.exports = router;