const express = require('express');
const router = express.Router();
const downloadController = require('../controller/downloadData');

router.get('/downloads', downloadController.downloadStudentData);

module.exports = router;
