const express = require("express");
const router = express.Router();
const empCortroller = require("../controllers/empController");

router.post("/login" ,  empCortroller.emptask)
router.get("/showtask/:id" , empCortroller.showTask)
router.post("/sendreport" , empCortroller.sendReport)
router.get("/notifications/:empid", empCortroller.getNotifications);
router.put("/marknotificationread/:notificationId", empCortroller.markNotificationAsRead);
router.get("/unreadcount/:empid", empCortroller.getUnreadCount);


module.exports = router