const express = require('express');
const moment = require('moment');
const db = require('../db');
const { queryAsPromise } = require('../db-helper');
const { buildDataTableEndpoint } = require('./helper/data-table-helper');

const router = express.Router();

router.get('/', function(req, res){
  // Get FacultyName
  var facultyCode = req.user.StudentID.slice(-2);
  var facultyName = '';
  var sql = 'select * from FACULTY, CURRICULUM_STUDENT_INFO where FACULTY.FacultyCode = ' + facultyCode + ' and CURRICULUM_STUDENT_INFO.StudentID4 = ' + req.user.StudentID + ';';

  db.query(sql, function (err, result) {
      if (err) {
        return next(err);
      }
    facultyName = result[0].FacultyName;
    departmentName = result[0].CurriculumName4;

    sql = 'select CourseIDl1, SectionNumberl1 from REQUEST where StudentIDl1 = ' + req.user.StudentID + ' and AcademicYearl1 = 2018 and Terml1 = 1 and RequestStatus = ' + "'" + "PENDING" + "'"+ ';';
    db.query(sql, function(err, result){
      if (err){
        return next(err);
      }
      var allRequestSubjects = '';
      for (i = 0; i < result.length; i++) { 
        allRequestSubjects += result[i].CourseIDl1 + " section " + result[i].SectionNumberl1 + "\n";
      }

      sql = 'select CourseIDl2, SectionNumberl2 from STUDY where StudentIDl2 = ' + req.user.StudentID + ' and AcademicYearl2 = 2018 and Terml2 = 1' + ';';
      console.log(sql);
      db.query(sql, function(err, result){
        if (err){
          return next(err);
        }
        var allStudySubjects = '';
        for (i = 0; i < result.length; i++) { 
          allStudySubjects += result[i].CourseIDl2 + " section " + result[i].SectionNumberl2 + "\n";
        }
        // Render
        res.render('student_info/main', {
          user: req.user.StudentID,
          name: req.user.StudentFirstName,
          lastname: req.user.StudentLastName,
          sex: req.user.Gender,
          nationalid: req.user.NationalID,
          studentid: req.user.StudentID,
          facultyname: facultyName,
          departmentname: departmentName,
          bloodgroup: req.user.BloodGroup,
          road: req.user.Road,
          district: req.user.District,
          subdistrict: req.user.SubDistrict,
          provice: req.user.Province,
          postalcode: req.user.PostalCode,
          email: req.user.Email,
          allrequestsubjects: allRequestSubjects,
          allstudysubjects: allStudySubjects
        });
      })
    })
  });
});

module.exports = router;
