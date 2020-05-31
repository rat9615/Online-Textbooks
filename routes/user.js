const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userreg = require('../models/userreg');
const Requestbook = require('../models/requestbook');

// Static
router.use(express.static('public'));
router.use('/reset-password/token', express.static('public'));

// Check Authentication
function isAuthenticated(req, res, done) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return done();
}

router.get('/login', isAuthenticated, (req, res) => {
  return res.render('login', { messages: req.flash('error') });
});

// Forgot-Password
router.get('/forgot-password', isAuthenticated, (req, res) => {
  return res.render('forgot-password');
});

// Send password reset link
router.post('/forgot-password', isAuthenticated, (req, res) => {
  userreg.findOne({ username: req.body.email }, async (err, data) => {
    if (data) {
      // Jwt token
      const token = jwt.sign(
        { data: req.body.email },
        'FDA73CA4BBC749D5B4D9332B7C9FF',
        {
          expiresIn: '2h', // 2h,
        }
      );
      res.cookie('forgotpasswordjwt', token, { httpOnly: true });
      // Using nodemailer to send mail
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await transporter.sendMail({
        from: '"Admin" <no-reply@smash.com>',
        to: `${req.body.email}`,
        subject: 'Reset your Password', // Subject line
        html: `<b>Hi ${data.firstname},</b><br /><br />We heard that you lost your Online Textbooks password. Sorry about that!<br />
        But don’t worry! You can use the following link to reset your password:<br /><br />
        http://${req.headers.host}/users/reset-password/token/${token}<br />
        If you don’t use this link within the next 2 hours, it will expire.<br /><br /><br />
        Thanks,<br />
        <i>The Online Textbooks Team</i>`,
      });
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      req.flash(
        'success',
        `Please check ${req.body.email} for a link to reset your password. `
      );
      res.locals.messages = req.flash();
      return res.render('forgot-password');
    }
    req.flash('error', 'No account found with that email!');
    res.locals.messages = req.flash();
    return res.render('forgot-password');
  });
});

// checkToken middleware
function checkToken(req, res, done) {
  jwt.verify(
    req.params.token,
    'FDA73CA4BBC749D5B4D9332B7C9FF',
    (err, decoded) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Password reset link is invalid or has expired!');
        res.locals.messages = req.flash();
        return res.render('forgot-password');
      }
      res.locals.token = decoded.data;
      return done();
    }
  );
}
// Reset Password
router.get(
  '/reset-password/token/:token',
  isAuthenticated,
  checkToken,
  (req, res) => {
    userreg.findOne({ username: res.locals.token }, (err, data) => {
      if (data) {
        return res.render('reset-password');
      }
      req.flash('error', 'Password reset link is invalid or has expired!');
      res.locals.messages = req.flash();
      return res.render('forgot-password');
    });
  }
);

// jwtcookie middleware
function jwtcookie(req, res, done) {
  const jwtcookies = req.cookies.forgotpasswordjwt;
  jwt.verify(jwtcookies, 'FDA73CA4BBC749D5B4D9332B7C9FF', (err, decoded) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Password reset link is invalid or has expired!');
      res.locals.messages = req.flash();
      return res.render('forgot-password');
    }
    res.locals.token = decoded.data;
    return done();
  });
}

router.post(
  '/reset-password',
  isAuthenticated,
  [
    check('password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .withMessage('Password did not meet the requirements specified!'),
  ],
  jwtcookie,
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const passerror = { error: err.errors[0].msg };
      res.locals.messages = passerror;
      console.log(res.locals.messages);
      res.render('reset-password');
    } else if (req.body.password !== req.body.confirmpassword) {
      req.flash('error', 'Passwords do not match!');
      res.locals.messages = req.flash();
      res.render('reset-password');
    } else {
      userreg.findOne({ username: res.locals.token }, async (error, data) => {
        if (data) {
          await data.setPassword(req.body.password);
          await data.save();
          req.flash('success', 'Password successfully changed! Go to Login');
          res.locals.messages = req.flash();
          res.render('reset-password');
        } else {
          req.flash(
            'error',
            'Password could not be changed! Contact Administrator!'
          );
          res.locals.messages = req.flash();
          res.render('reset-password');
        }
      });
    }
  }
);
// Register
router.get('/register', isAuthenticated, (req, res) => {
  return res.render('register', { user: 'null' });
});

// Requestbook
// should validate if a usn already exists
router.post('/request', async (req, res) => {
  const request = new Requestbook({
    name_of_the_book: req.body.bookname,
    year_of_publication: req.body.pub, // how will user know year of publication
    name_of_author: req.body.nameofauth,
    Edition: req.body.edition,
    usn: req.user.usn,
  });
  await request.save();
  return res.json(req.body.bookname);
});

router.get('/request', isAuthenticated, (req, res) => {
  return res.render('login');
});

// Logout
router.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logOut();
    return res.redirect('/users/login');
  }
  return res.redirect('/users/login');
});

router.post(
  '/register',
  [
    check('usn', 'USN should be 10 characters long').isLength({
      max: 10,
      min: 10,
    }),
    check('course', 'Please enter Course!').exists().trim().not().isEmpty(),
    check('password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .withMessage('Password did not meet the requirements specified!'),
  ],
  (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.render('register', { user: 'error', err: err.errors[0].msg });
    } else {
      userreg.register(
        // eslint-disable-next-line new-cap
        new userreg({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.email,
          usn: req.body.usn, // validate so that no space is taken or else request modal wont work
          course: req.body.course,
        }),
        req.body.password,
        (error) => {
          if (error) {
            console.log(error);
          } else {
            res.render('submit-success', { username: req.body.firstname });
          }
        }
      );
    }
  }
);

module.exports = router;
