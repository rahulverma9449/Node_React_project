const Interview = require('../models/interview');
const Student = require('../models/student');
exports.home = async (req, res) => {
  try {
    const students = await Student.find();
    const interviews = await Interview.find();

    res.render('home', { students, interviews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
