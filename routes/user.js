const express = require('express');

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
    year_of_publication: req.body.pub,
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
    }
  );
});

module.exports = router;
