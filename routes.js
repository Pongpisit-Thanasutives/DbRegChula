const express = require('express');
const {
  requireLogin,
  requireLogout,
  requireLoginNoWarning,
  requireManagerRole,
  requireAdvisorRole
} = require('./routes/helper/common-middleware');

const loginRoute = require('./routes/login');
const studentInfoRoute = require('./routes/student_info');
const managerBoardRoute = require('./routes/manager_board');
const advisorRoute = require('./routes/advisor');
const courseRoute = require('./routes/course');
const aboutRoute = require('./routes/about');
const enrollRoute = require('./routes/enroll');
const withdrawRoute = require('./routes/withdraw');
const tuitionfeeRoute = require('./routes/tuitionfee');
const addAndDeleteRoute = require('./routes/add_and_delete');
const registerRoute = require('./routes/register');

const router = express.Router();

router.use('/login', requireLogout, loginRoute);
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

router.use('/student-info', requireLogin, studentInfoRoute);
router.use('/manager-board', requireLogin, requireManagerRole, managerBoardRoute);
router.use('/course', requireLogin, courseRoute);
router.use('/enroll', requireLogin, enrollRoute);
router.use('/withdraw', requireLogin, withdrawRoute);
<<<<<<< HEAD
router.use('/tuitionfee', requireLogin, tuitionfeeRoute);
=======
router.use('/addanddelete', requireLogin, addAndDeleteRoute);
router.use('/register', requireLogin, registerRoute);
>>>>>>> e9f5bf4632cc864094efec36b33050d887233b69

// We use this trick to show login warning only if user does not come from '/' URL.
router.get('/', requireLoginNoWarning, (req, res, next) => {
  if (req.user.type === 'A') {
    res.redirect('/student-info');
  } else if (req.user.type === 'M') {
    res.redirect('/student-info');
  } else {
    next();
  }
});
router.use('/', requireLogin);

module.exports = router;