const express = require("express");
const router = express.Router();
const adminCortroller = require("../controllers/adminController");


router.post("/login" ,adminCortroller.adminLogin);
router.post("/createuser" , adminCortroller.createUser);
router.get("/empdatalist" , adminCortroller.empDataList);
router.get("/viewusers" , adminCortroller.empDataList); // Alias for empdatalist
router.post("/assigntask" ,adminCortroller.assignTask )
router.get("/alltasks", adminCortroller.getAllTasks);
router.put("/updatetaskstatus/:id", adminCortroller.updateTaskStatus);
router.get("/seereport" , adminCortroller.seeReport);
router.get("/reportdetail/:id", adminCortroller.getReportDetail);
router.post("/replyreport/:taskId", adminCortroller.replyToReport);
router.delete("/deleteuser/:id", adminCortroller.deleteUser);
router.put("/updateuser/:id", adminCortroller.updateUser);




module.exports = router;