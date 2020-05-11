const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const userreg = require('../models/userreg');
const Requestbook = require('../models/requestbook');

// static
router.use(express.static('public'));

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('login', { messages: req.flash('error') });
});

// forgot-password
router.get('/forgot-password', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('forgot-password');
});

// register
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('register', { user: 'null' });
});

// requestbook
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

router.get('/request', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('login');
});

// logout
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
      .withMessage(
        'Password should be a combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long'
      ),
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
