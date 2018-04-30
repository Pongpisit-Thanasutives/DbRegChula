const express = require('express');
const router = express.Router();
const db = require('../db');
const dbHelper = require('../db-helper');
const moment = require('moment');

router.get('/', function(req, res) {
  var courseID = req.query.cid;
  var courseName = req.query.shortname;
  if(courseID && courseID.length > 0 && courseName && courseName.length > 0){
    courseID = '"%'+req.query.cid.trim()+'%"';
    courseName = '"%' + req.query.shortname.trim() + '%"';
    console.log(req.query.semester);
    var year = req.query.semester[0].split("/")[0];
    var sem = req.query.semester[0].split("/")[1];
    let sql = "SELECT C.CourseID AS ID, C.CourseInitial AS Initial FROM Course C, Section S WHERE C.CourseID = S.CID AND S.AcademicYear_section = "
              + year + " AND Term_section = "+ sem +" AND C.CourseID LIKE "+courseID+" AND C.CourseInitial LIKE "+courseName+" ORDER BY C.CourseID LIMIT 14";
    db.query(sql,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.render('course', {
            searched: true,
            moment: moment,
            serverTime: moment().format('LLLL'),
            data: [],
            year: year,
            sem: sem,
            user: req.user
          });
          return;
        }
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          year: year,
          sem: sem,
          user: req.user
        });
      }
    );
  } else if(courseID && courseID.length > 0 && !courseName){
    var year = req.query.semester[0].split("/")[0];
    var sem = req.query.semester[0].split("/")[1];
    let sql = "SELECT C.CourseID AS ID, C.CourseInitial AS Initial FROM Course C, Section S WHERE C.CourseID = S.CID AND S.AcademicYear_section = "
              + year + " AND Term_section = "+ sem +" AND C.CourseID LIKE ? ORDER BY C.CourseID LIMIT 14";
    let inserts = [courseID.trim() + '%'];
    db.query(sql, inserts,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.render('course', {
            searched: true,
            moment: moment,
            serverTime: moment().format('LLLL'),
            data: [],
            year: year,
            sem: sem,
            user: req.user
          });
        }
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          year: year,
          sem: sem,
          user: req.user
        });
      }
    );
  } else if(!courseID && courseName && courseName.length > 0){
    var year = req.query.semester[0].split("/")[0];
    var sem = req.query.semester[0].split("/")[1];
    let sql = "SELECT C.CourseID AS ID, C.CourseInitial AS Initial FROM Course C, Section S WHERE C.CourseID = S.CID AND S.AcademicYear_section = "
              + year + " AND Term_section = "+ sem +" AND C.CourseInitial LIKE ? ORDER BY C.CourseID LIMIT 14";
    let inserts = ['%' + courseName.trim() + '%'];
    db.query(sql, inserts,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.render('course', {
            searched: true,
            moment: moment,
            serverTime: moment().format('LLLL'),
            data: [],
            user: req.user
          });
        }
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          year: year,
          sem: sem,
          user: req.user
        });
      }
    );
  } else {
    var year;
    var sem;
    if(req.query.semester){
      year = req.query.semester[0].split("/")[0];
      sem = req.query.semester[0].split("/")[1];
    }
    else{
      year = 2018;
      sem = 1;
    }
    let sql = "SELECT C.CourseID AS ID, C.CourseInitial AS Initial FROM Course C, Section S WHERE C.CourseID = S.CID AND S.AcademicYear_section = "
              + year + " AND Term_section = "+ sem +" ORDER BY C.CourseID LIMIT 14";
    console.log(sql);
    db.query(sql,
      (err, rows) => {
        if (err) {
          res.render('course', {
            searched: true,
            moment: moment,
            serverTime: moment().format('LLLL'),
            data: [],
            year: year,
            sem: sem,
            user: req.user
          });
        }
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          year: year,
          sem: sem,
          user: req.user
        });
      }
    );
  }
});

router.post('/detail', function(req, res) {
  let course_no = req.body.course_no;
  let year = req.body.year;
  let sem = req.body.sem;
  let sql = "SELECT * FROM COURSE C, SECTION S WHERE C.CourseID = "+course_no
          +" AND S.CID = "+course_no;

  let sql2 = "SELECT * FROM PREREQUISITE P WHERE CourseIDl5 = "+course_no;
  let sql3 = "SELECT * FROM SECTION S, TEACHDAY T WHERE S.CID = T.CIDD"
        + " AND T.AcademicYear_sectionD = "+year+" AND T.AcademicYear_sectionD = S.AcademicYear_section"
        + " AND T.Term_sectionD = " + sem + " AND T.Term_sectionD = S.Term_section AND S.SectionNumber = T.SectionNumberD ORDER BY S.SectionNumber";
  console.log(sql);
  db.query(sql,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      db.query(sql2,
        (err, rows2) => {
          if(err){
            return next(err);
          }
          var info = [];
          for(let i=0;i<rows2.length;i++){
            info.push(rows2[i].PrecourseIDl5);
          }
          rows[0].Prerequisite = info;
          db.query(sql3,
            (err, rows3) => {
              if(err){
                return next(err);
              }
              var prev = null;
              var idx = 0;
              rows[0]['Sections'] = [];
              for(let i=0;i<rows3.length;i++){
                if(i == 0){
                  prev = rows3[0].SectionNumber;
                  rows[0]['Sections'].push([]);
                }
                if(prev != rows3[i].SectionNumber){
                  prev = rows3[0].SectionNumber;
                  rows[0]['Sections'].push([]);
                  idx++;
                }
                let tmp = {};
                tmp.SectionNumber = rows3[i].SectionNumber;
                tmp.SecStatus = rows3[i].SecStatus;
                tmp.StudentCapacity = rows3[i].StudentCapacity;
                tmp.NumberOfStudent = rows3[i].NumberOfStudent;
                tmp.TDayD = rows3[i].TDayD;
                tmp.TeachTimeStD = rows3[i].TeachTimeStD;
                tmp.TeachTimeFnD = rows3[i].TeachTimeFnD;
                tmp.TeachStyleD = rows3[i].TeachStyleD;
                rows[0]['Sections'][idx].push(tmp);
              }
              console.log(rows);
              res.send(rows);
            }
          );
        }
      );
    }
  );
});

module.exports = router;
