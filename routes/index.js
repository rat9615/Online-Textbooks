const express = require('express');
const fu = require('express-fileupload');

const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const Books = require('../models/books');
const Requestbook = require('../models/requestbook');
// static
router.use(express.static('public'));
router.use(fu());
router.use(flash());

// index
router.get('/', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      Requestbook.find({}, (err, data) => {
        res.render('admin-index', {
          login: req.user,
          requestbook: data,
        });
      });
      return done;
    }
    return res.render('index', { login: req.user });
  }
  return res.redirect('/users/login');
});

router.post(
  '/',
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: { type: 'error', message: 'Invalid Username or Password!' } }),
  (req, res, done) => {

    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      Requestbook.find({}, (err, data) => {

        res.render('admin-index', {
          login: req.user,
          requestbook: data,
        });
      });
      return done;
    }
    return res.render('index', { login: req.user });
  }
);

// download books
router.get('/download-books', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('download', { login: req.user, user: 'admin' });
    }
    return res.render('download', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// branch
router.get('/branch', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('branch', { login: req.user, user: 'admin' });
    }
    return res.render('branch', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// semester
router.get('/semester', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('semesters', { login: req.user, user: 'admin' });
    }
    return res.render('semesters', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// authors
router.get('/author', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('authors', { login: req.user, user: 'admin' });
    }
    return res.render('authors', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// admin upload books page
router.get('/upload-books', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('admin-upload', { login: req.user, books: 'empty' });
    }
  }
  return res.redirect('/users/login');
});

// uploading the books
router.post(
  '/upload-books',
  // Books.upload.single('pdffiles'),
  async (req, res) => {
    // eslint-disable-next-line new-cap
    const book = new Books.books({
      bookname: req.body.bookname,
      bookedition: req.body.bookedition,
      year: new Date(req.body.year),
      course: req.body.course,
      semester: req.body.semester,
      // eslint-disable-next-line no-underscore-dangle
      // pdffiles: req.file.id,
    });
    await book.save();
    return res.json({ file: req.file });
    /* res.render('admin-upload', {
      login: req.user,
      books: 'full',
      bookname: req.body.bookname,
    }); */
  }
);

router.post('/uploads', (req) => {
  console.log(req.files);
  const uploadFile = req.files.pdffiles;
  // const fileName = req.files.file.name;
  uploadFile.mv(`${__dirname}/public/uploads/svs`);
});

// remove book requests
router.get('/remove-books', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      Requestbook.deleteOne({ _id: req.body.id }, (err, data) => {
        res.render('admin-index', {
          login: req.user,
          requestbook: data,
        });
      });
      return done;
    }
    return res.redirect('/');
  }
  return res.redirect('/users/login');
});
module.exports = router;
