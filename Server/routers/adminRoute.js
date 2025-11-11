const express = require("express");
const router = express.Router();
const adminCortroller = require("../controllers/adminController");


router.post("/login" ,adminCortroller.adminLogin);
router.post("/createuser" , adminCortroller.createUser);
router.get("/empdatalist" , adminCortroller.empDataList);
router.post("/assigntask" ,adminCortroller.assignTask )
router.get("/seereport" , adminCortroller.seeReport);




module.exports = router;