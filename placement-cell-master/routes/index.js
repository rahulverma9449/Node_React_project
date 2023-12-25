const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController');

// Home page route
router.get('/', homeController.home);
router.use('/users', require('./user'));
router.use('/student', require('./student'));
router.use('/interview', require('./interview'));
router.use('/download', require('./download'));




module.exports = router;
