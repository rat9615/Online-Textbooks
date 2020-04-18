const express = require('express');

const router = express.Router();
const passport = require('passport');
// static
router.use(express.static('public'));

// index
router.get('/', (req, res, done) => {
  if (req.isAuthenticated()) {
    res.render('index', { login: req.user });
  }
  return done();
});
router.post(
  '/',
  passport.authenticate('local', { failureRedirect: '/users/login' }),
  (req, res) => {
    res.render('index', { login: req.user });
  },
);

// download books
router.get('/download-books', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('download');
  }
  res.redirect('/users/login');
});

// branch
router.get('/branch', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('branch');
  }
  res.redirect('/users/login');
});

// semester
router.get('/semester', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('semesters');
  }
  res.redirect('/users/login');
});

// authors
router.get('/author', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('authors');
  }
  res.redirect('/users/login');
});

module.exports = router;
