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

const router = express.Router();

router.use('/login', requireLogout, loginRoute);
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

router.use('/student-info', requireLogin, studentInfoRoute);
router.use('/manager-board', requireLogin, requireManagerRole, managerBoardRoute);
router.use('/course', requireLogin, courseRoute);
router.use('/about', requireLogin, aboutRoute);
router.use('/enroll', requireLogin, enrollRoute);
router.use('/withdraw', requireLogin, withdrawRoute);

// We use this trick to show login warning only if user does not come from '/' URL.
router.get('/', requireLoginNoWarning, (req, res, next) => {
  if (req.user.type === 'A') {
    res.redirect('/advisor');
  } else if (req.user.type === 'M') {
    res.redirect('/manager-board');
  } else {
    next();
  }
});
router.use('/', requireLogin);

module.exports = router;
