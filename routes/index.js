const express = require('express');

const router = express.Router();
const passport = require('passport');
// static
router.use(express.static('public'));

// index
router.get('/', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('admin-index', { login: req.user });
      return done();
    }
    res.render('index', { login: req.user });
    return done();
  }
  return res.redirect('/users/login');
});

router.post(
  '/',
  passport.authenticate('local', { failureRedirect: '/users/login' }),
  (req, res, done) => {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('admin-index', { login: req.user });
      return done();
    }
    return res.render('index', { login: req.user });
  },
);

// download books
router.get('/download-books', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('download', { login: req.user, user: 'admin' });
      return done();
    }
    res.render('download', { login: req.user, user: 'regular' });
    return done();
  }
  return res.redirect('/users/login');
});

// branch
router.get('/branch', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('branch', { login: req.user, user: 'admin' });
      return done();
    }
    res.render('branch', { login: req.user, user: 'regular' });
    return done();
  }
  return res.redirect('/users/login');
});

// semester
router.get('/semester', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('semesters', { login: req.user, user: 'admin' });
      return done();
    }
    res.render('semesters', { login: req.user, user: 'regular' });
    return done();
  }
  return res.redirect('/users/login');
});

// authors
router.get('/author', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('authors', { login: req.user, user: 'admin' });
      return done();
    }
    res.render('authors', { login: req.user, user: 'regular' });
    return done();
  }
  return res.redirect('/users/login');
});

// admin upload books
router.get('/upload-books', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      res.render('admin-upload', { login: req.user });
      return done();
    }
  }
  return res.redirect('/users/login');
});
module.exports = router;
