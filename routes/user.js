const express = require('express');

const router = express.Router();
const userreg = require('../models/userreg');

// static
router.use(express.static('public'));

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('login');
});

// forgot-password
router.get('/forgot-password', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('forgot-password');
});

// register
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('register', { user: 'null' });
});

// logout
router.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logOut();
    res.redirect('/users/login');
  }
});
router.post('/register', (req, res) => {
  userreg.register(
    // eslint-disable-next-line new-cap
    new userreg({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.email,
      usn: req.body.usn,
      course: req.body.course,
    }),
    req.body.password,
    (err) => {
      if (err) {
        console.log(err);
        res.render('register', { user: 'error' });
      } else {
        console.log('no error');
        res.render('submit-success', { username: req.body.firstname });
      }
    },
  );
});

module.exports = router;
