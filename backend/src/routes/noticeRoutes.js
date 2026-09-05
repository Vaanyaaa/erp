const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const { authenticate, authorize } = require("../middleware/auth");

// Only TP Cell admins and professors can post notices.
router.post(
  "/",
  authenticate,
  authorize("tp_admin", "professor"),
  noticeController.createNotice
);

// Anyone logged in can read notices.
router.get("/", authenticate, noticeController.listNotices);
router.get("/:id", authenticate, noticeController.getNotice);
router.delete("/:id", authenticate, noticeController.deleteNotice);

module.exports = router;
