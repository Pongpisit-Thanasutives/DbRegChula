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
    // let sql =  "SELECT C.CourseID AS ID, C.CourseInitial AS Initial FROM COURSE C WHERE C.CourseID LIKE ? AND C.CourseInitial LIKE ? LIMIT 14";
    // let sql = "SELECT S.CID AS ID, C.CourseInitial AS Initial FROM SECTION S, COURSE C WHERE C.CourseID = S.CID AND C.CourseID LIKE "
    //           + courseID + "AND C.CourseInitial LIKE "+courseName + " AND S.AcademicYear_section = " + year + " AND Term_section = "
              // + sem + " LIMIT 14";
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
  let sql = "SELECT * FROM COURSE C, PREREQUISITE P, SECTION S WHERE C.CourseID = "+course_no
          +" AND P.CourseIDl5 = "+course_no+" AND S.CID = "+course_no;
  console.log(sql);
  db.query(sql,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      console.log(rows);
      res.send(rows);
    }
  );
});

router.post('/graph', function(req,res){
  let course_no = req.body.course_no;
  let sql =  baseSQL2+"where course_no = ? group by grade ";
  let inserts = [course_no];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows)
    }
  );
});

router.post('/graph2', function(req,res){
  let course_no = req.body.course_no;
  let sql =  baseSQL2+"where course_no = ? and year = '2016' group by grade ";
  let inserts = [course_no];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows)
    }
  );
});

router.post('/graph3', function(req,res){
  let course_no = req.body.course_no;
  let sql =  baseSQL2+"where course_no = ? and year = '2015' group by grade ";
  let inserts = [course_no];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      res.send(rows)
    }
  );
});

module.exports = router;
