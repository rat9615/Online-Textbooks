const express = require('express');
// const connect = require('connect');
// const flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userreg = require('../models/userreg');
const Requestbook = require('../models/requestbook');

// static
router.use(express.static('public'));

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('login');
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

let regex = "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$";
router.post('/register', [
  check('firstname', 'Please enter your first name').exists().trim().escape().not().isEmpty(),
  check('lastname', 'Please enter your last name').exists().trim().not().isEmpty(),
  check('email', 'Please enter an email').exists().trim().not().isEmpty(),
  check('usn', 'Please enter USN').exists().trim().not().isEmpty(),
  check('usn', 'Please enter valid USN').isLength({ max: 10, min: 10 }),
  check('course', 'Please enter Course').exists().trim().not().isEmpty(),
  check('password', 'Please enter password').exists().trim().not().isEmpty(),
  //check('usn', 'Please enter valid USN').isLength({ max: 10, min: 10 }), regex for USN , sort out from other branches
  // check('password', 'Password criteria not satisfied:').custom((regex, { req, loc, path }) => {
  //   if (regex !== req.body.password) {
  //     throw new Error("Password should contain minimum eight characters, at least one letter, one number and one special character");

  //   }
  // }),



], (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    // const user = $('errors');
    // console.log(erro);
    res.render('register.ejs', { user: 'error', err: err.errors[0].msg });


  } else {
    userreg.register(
      // eslint-disable-next-line new-cap
      new userreg({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.email,
        usn: req.body.usn, // validate so that no space is taken or else request modal wont work
        course: req.body.course,
      })),


      res.render('submit-success', { username: req.body.firstname });
  }

}
);



module.exports = router;
