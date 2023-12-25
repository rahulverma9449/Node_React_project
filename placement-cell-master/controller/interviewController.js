// controllers/interviewController.js
const Interview = require('../models/interview');
const passport = require('passport');

// Render add interview form
exports.renderAddInterviewForm = (req, res) => {
  if (req.isAuthenticated()) {
    res.render('interview');
  } else {
    res.redirect('/users/sign-in'); // Redirect to the login page if the user is not authenticated
  }
};

// Handle the POST request to add a new interview
exports.addInterview = async (req, res) => {
  const { companyName, date } = req.body;

  try {
    const newInterview = new Interview({
      companyName,
      date,
      
    });

    await newInterview.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving interview data.');
  }
};

// Display all interviews
exports.displayInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({});
    res.render('home', { interviews }); // Change 'students' to 'interviews'
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving interviews.');
  }
};
