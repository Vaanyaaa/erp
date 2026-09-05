const express = require("express");
const router = express.Router();
const ocrController = require("../controllers/ocrController");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

router.post(
  "/extract",
  authenticate,
  upload.single("file"),
  ocrController.uploadAndExtract
);

module.exports = router;
