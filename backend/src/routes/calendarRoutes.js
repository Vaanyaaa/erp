const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const { authenticate, authorize } = require("../middleware/auth");

router.post(
  "/",
  authenticate,
  authorize("tp_admin", "professor"),
  calendarController.createEvent
);
router.get("/week", authenticate, calendarController.getWeek);
router.delete(
  "/:id",
  authenticate,
  authorize("tp_admin", "professor"),
  calendarController.deleteEvent
);

module.exports = router;
