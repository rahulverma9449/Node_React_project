const express = require('express');
const router = express.Router();

const interviewController = require('../controller/interviewController');

router.get('/add', interviewController.renderAddInterviewForm);
router.post('/add', interviewController.addInterview);
router.get('/interviews', interviewController.displayInterviews);


module.exports = router;
