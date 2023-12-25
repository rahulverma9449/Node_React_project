const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

// Add student route
router.get('/add', studentController.renderAddStudentForm);
router.post('/create', studentController.addStudent);

// Display student details
router.get('/:id', studentController.displayStudentDetails);

// Delete a student
router.delete('/delete/:id', studentController.deleteStudent);
// Render edit student form
router.get('/edit/:id', studentController.renderEditStudentForm);

router.post('/update/:id', studentController.updateStudent);
router.post('/:id/select-interview', studentController.selectInterview);


module.exports = router;
