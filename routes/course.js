const express = require('express');
const router = express.Router();
const db = require('../db');
const dbHelper = require('../db-helper');
const moment = require('moment');

router.get('/', function(req, res) {
  const courseID = req.query.cid;
  const courseName = req.query.shortname;
  if(courseID && courseID.length > 0 && courseName && courseName.length > 0){
    let sql =  "SELECT C.CourseID AS ID, C.CourseName AS Name, C.CourseInitial AS Initial, C.Credit FROM COURSE C WHERE C.CourseID LIKE ? AND C.CourseInitial LIKE ? LIMIT 14";
    let inserts = ['%' + courseID.trim() + '%', '%' + courseName.trim() + '%'];
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
        console.log(rows);
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          user: req.user
        });
      }
    );
  } else if(courseID && courseID.length > 0 && !courseName){
    let sql = "SELECT C.CourseID AS ID, C.CourseName AS Name, C.CourseInitial AS Initial, C.Credit FROM COURSE C WHERE C.CourseID LIKE ? LIMIT 14";
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
            user: req.user
          });
        }
        console.log(rows);
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          user: req.user
        });
      }
    );
  } else if(!courseID && courseName && courseName.length > 0){
    let sql = "SELECT C.CourseID AS ID, C.CourseName AS Name, C.CourseInitial AS Initial, C.Credit FROM COURSE C WHERE C.CourseInitial LIKE ? LIMIT 14";
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
        console.log(rows);
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          user: req.user
        });
      }
    );
  } else {
    let sql = "SELECT C.CourseID AS ID, C.CourseName AS Name, C.CourseInitial AS Initial, C.Credit FROM Course C "
              +"order by C.CourseID"+ " LIMIT 14 ";
    db.query(sql,
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
        console.log(rows);
        res.render('course', {
          searched: true,
          moment: moment,
          serverTime: moment().format('LLLL'),
          data: rows,
          user: req.user
        });
      }
    );
  }
});

router.post('/detail', function(req, res) {
  let course_no = req.body.course_no;
  console.log(req.body);
  let sql = "SELECT * FROM COURSE C WHERE C.CourseID = ? ";
  let inserts = [course_no];
  db.query(sql, inserts,
    (err, rows) => {
      if (err) {
        return next(err);
      }
      console.log(rows[0]);
      res.send(rows[0]);
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
