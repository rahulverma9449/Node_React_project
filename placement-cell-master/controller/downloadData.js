const fs = require('fs');
const Student = require('../models/student');

// Download student data with interview details in CSV format
exports.downloadStudentData = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/sign-in');
  }
  try {
    const students = await Student.find().populate('interviews');

    // Convert students and interview data into CSV format
    const csvData = [];
    for (const student of students) {
      if (student.interviews.length === 0) {
        // If the student has no interview data, include them in the CSV with empty interview fields
        csvData.push({
          name: student.name || '',
          email: student.email || '',
          batch: student.batch || '',
          college: student.college || '',
          dsaScore: student.dsaScore || '',
          webdScore: student.webdScore || '',
          reactScore: student.reactScore || '',
          placementStatus: student.placementStatus || '',
          companyName: '',
          date: '',
          result: '',
        });
      } else {
        // If the student has interview data, include each interview in the CSV
        for (const interview of student.interviews) {
          csvData.push({
            name: student.name || '',
            email: student.email || '',
            batch: student.batch || '',
            college: student.college || '',
            dsaScore: student.dsaScore || '',
            webdScore: student.webdScore || '',
            reactScore: student.reactScore || '',
            placementStatus: student.placementStatus || '',
            companyName: interview.companyName || '',
            date: interview.date || '',
            result: interview.result || '',
          });
        }
      }
    }

    if (csvData.length === 0) {
      return res.status(404).send('No student data found.');
    }

    const fields = ['name', 'email', 'batch', 'college', 'dsaScore', 'webdScore', 'reactScore', 'placementStatus', 'companyName', 'date', 'result'];
    const csv = convertToCsvString(csvData, fields);

    const filePath = './student_data.csv';

    // Write the CSV data to the file
    fs.writeFileSync(filePath, csv, 'utf8');

    // Stream the file as a download response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=student_data.csv');
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    // Remove the temporary file after streaming is complete
    res.on('finish', () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error downloading student data.');
  }
};

// Helper function to convert data to CSV string
function convertToCsvString(data, fields) {
  const delimiter = ',';
  const header = fields.join(delimiter) + '\n';
  const body = data.map((item) => fields.map((field) => item[field]).join(delimiter)).join('\n');
  return header + body;
}
