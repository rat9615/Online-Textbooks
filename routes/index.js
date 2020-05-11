const express = require('express');

const router = express.Router();
const fileupload = require('express-fileupload');
// const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Books = require('../models/books');
const Requestbook = require('../models/requestbook');

// static
router.use(express.static('public'));
router.use(fileupload({ useTempFiles: true, tempFileDir: '/tmp/' }));
// router.use(flash());

// mongoose connection => only for gridfs
const url = 'mongodb://localhost:27017/onlinetextbookdbs';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// gridfs connection
const db = mongoose.connection;
let gfs;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('Connected Successfully');
  gfs = new mongoose.mongo.GridFSBucket(db.db);
});

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
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: { type: 'error', message: 'Invalid Email or Password!' },
  }),
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

router.post('/upload-books', async (req, res) => {
  // validate => when upload file is not entered schema details should not be entered also
  const book = new Books({
    bookname: req.body.bookname,
    bookedition: req.body.bookedition,
    year: new Date(req.body.year),
    course: req.body.course,
    author: req.body.author,
    semester: req.body.semester,
  });
  await book.save();
  const writeStream = gfs.openUploadStream('resume.pdf');
  // uploading file => uploads
  fs.createReadStream(
    path.join(__dirname, '../public/uploads', 'resume.pdf')
  ).pipe(writeStream);
  console.log('done');
  // deleting file => uploads
  fs.unlinkSync(
    path.join(__dirname, '../public/uploads', 'resume.pdf'),
    (err) => {
      if (err) throw err;
      console.log('File deleted!');
    }
  );
});

// filepond upload to server
router.post('/uploads', (req, res) => {
  const filename = req.files.filepond;
  req.files.filepond.mv(
    path.join(__dirname, '../public/uploads', filename.name)
  );
  // need some validation here incase file fails to upload
  res.send('File Uploaded');
});

// remove book requests
router.get('/remove-books/:id', (req, res, done) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      Requestbook.deleteOne({ _id: req.params.id }, (err, data) => {
        res.redirect('/');
      });
      return done;
    }
    return res.redirect('/');
  }
  return res.redirect('/users/login');
});

module.exports = router;
