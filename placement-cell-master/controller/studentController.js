const Student = require('../models/student');
const Interview = require('../models/interview');
const mongoose = require('mongoose');

// Render add student form
exports.renderAddStudentForm = (req, res) => {
  res.render('add_student');
};
exports.renderEditStudentForm = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Use .populate('interviews') to fetch the interviews associated with the student
    const student = await Student.findById(studentId).populate('interviews');

    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Store the actual Placement Status value ('Placed', 'Unplaced', etc.) in placedOption
    const placedOption = student.placementStatus || 'Unplaced';

    // Render the edit student form with the correct Placement Status value
    res.render('edit_student', { student, placedOption });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};




exports.displayStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId' });
    }

    const student = await Student.findById(studentId).populate('interviews');
    const interviews = await Interview.find({}); // Fetch all interviews

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return the student and interview details to the view
    res.render('student_detail', { student, interviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addStudent = async (req, res) => {
  const {
    name,
    email,
    batch,
    college,
    dsaScore,
    webdScore,
    reactScore,
    placementStatus,
    selectedInterviews // Assuming the selected interviews are sent as an array
  } = req.body;

  try {
    const newStudent = new Student({
      name,
      email,
      batch,
      college,
      dsaScore,
      webdScore,
      reactScore,
      placementStatus,
      interviews: [], // Initialize the interviews array
    });

    if (Array.isArray(selectedInterviews)) {
      // Associate the selected interviews with the student
      for (const interviewId of selectedInterviews) {
        // Create an interview object with the interview ID and default result 'On-Hold'
        newStudent.interviews.push({ interview: interviewId });
      }
    }

    // Save the new student with interview details
    await newStudent.save();

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving student data.');
  }
};
 
exports.selectInterview = async (req, res) => {
  const studentId = req.params.id;
  const { selectedInterview, selectedInterviewResult } = req.body;

  // Check if selectedInterview is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(selectedInterview)) {
    return res.status(400).send('Invalid interview ID');
  }

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Find the selected interview in the student's interviews array
    const selectedInterviewIndex = student.interviews.findIndex(
      (interview) => interview.interview && interview.interview.equals(selectedInterview)
    );

    if (selectedInterviewIndex !== -1) {
      // If the interview exists, update its result
      student.interviews[selectedInterviewIndex].result = selectedInterviewResult;

      // Fetch additional information from the Interview model and update it in the student's interviews array
      const interview = await Interview.findById(selectedInterview);
      if (interview) {
        student.interviews[selectedInterviewIndex].companyName = interview.companyName;
        student.interviews[selectedInterviewIndex].date = interview.date;
      }
    } else {
      // If the interview doesn't exist, create a new entry in the interviews array with the result
      const interview = await Interview.findById(selectedInterview);
      if (interview) {
        student.interviews.push({
          interview: selectedInterview,
          result: selectedInterviewResult,
          companyName: interview.companyName,
          date: interview.date,
        });
      }
    }

    // Save the student document with updated interviews
    await student.save();

    // Redirect back to the student detail page
    res.redirect(`/student/${studentId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error selecting interview for student.');
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.redirect('/'); // Redirect to the home page
  } catch (error) {
    res.status(500).send('An error occurred while deleting the student');
  }
};


exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    const {
      name,
      email,
      batch,
      college,
      dsaScore,
      webdScore,
      reactScore,
      placementStatus,
    } = req.body;

    // Convert the string value of "placed" to a boolean
    const isPlaced = placementStatus === 'Placed';

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name,
        email,
        batch,
        college,
        dsaScore,
        webdScore,
        reactScore,
        placementStatus, // Use the converted boolean value
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.redirect(`/student/${studentId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};