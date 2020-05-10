const express = require('express');
// const connect = require('connect');
const flash = require('connect-flash');
const passport = require('passport');
const { check, validationResult } = require('express-validator');


const router = express.Router();
const userreg = require('../models/userreg');
const Requestbook = require('../models/requestbook');

// static
router.use(express.static('public'));

router.use(flash());

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


router.post('/register', [
  check('usn', 'USN should be 10 characters long!').isLength({ max: 10, min: 10 }),
  // check('usn', 'USN must be entered in Uppercase!').isUppercase(),
  check('course', 'Please enter Course!').exists().trim().not().isEmpty(),
  check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Password should be a combination of one Uppercase, one special character and min 8 characters long!"),

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
    //req.flash("messages", { user: 'error', err: err.errors[0].msg });
    //res.locals.messages = err.errors[0].msg;
    res.render('register', { user: 'error', err: err.errors[0].msg });
    //req.flash("messages", { user: 'error', err: err.errors[0].msg });

    //res.render('register', { user: 'error', err: err.errors[0].msg });

    // const flashMessages = res.locals.getMessages();
    // console.log('flash', flashMessages);
    // if (flashMessages.error) {
    //   res.render('register', {
    //     showErrors: true,
    //     errors: flashMessages.error,
    //   })
    // }
    // else {
    //   res.render('register');
    // }
  } else {
    userreg.register(
      // eslint-disable-next-line new-caperr
      new userreg({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.email,
        usn: req.body.usn, // validate so that no space is taken or else request modal wont work
        course: req.body.course,

      }),
      req.body.password,
      (err) => {
        if (err) {
          console.log(err);
          // res.render('register', { user: 'error' });
        } else {
          res.render('submit-success', { username: req.body.firstname });
        }
      })
  };
});


module.exports = router;
