const express = require('express');

const router = express.Router();
const fileupload = require('express-fileupload');
const passport = require('passport');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Books = require('../models/books');
const Requestbook = require('../models/requestbook');
// static
router.use(express.static('public'));
router.use(fileupload({ useTempFiles: true, tempFileDir: '/tmp/' }));

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

// filepond upload to server
router.post('/uploads', (req, res) => {
  const filename = req.files.filepond;
  // validate if file does not fall into uploads folder
  req.files.filepond.mv(
    path.join(__dirname, '../public/uploads', filename.name),
    (err) => {
      if (err) throw err;
    }
  );
  req.flash('filename', filename.name);
  // need some validation here incase file fails to upload
  res.send('File Uploaded!');
});

router.post('/upload-books', async (req, res, done) => {
  let filename = req.flash('filename');
  filename = filename[0].toString();
  const writeStream = gfs.openUploadStream(filename);

  try {
    // uploading file => uploads
    fs.createReadStream(
      path.join(__dirname, '../public/uploads', filename),
      (err) => {
        if (err) console.log(err);
      }
    ).pipe(writeStream, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    done();
  } finally {
    // deleting file => uploads
    fs.unlinkSync(
      path.join(__dirname, '../public/uploads', filename),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  // validate => when upload file is not entered schema details should not be entered also
  // validate => when book name and edition already exists in database
  try {
    const book = new Books(
      {
        bookname: req.body.bookname, // validate in case user types same name but with spacing or changes capitalization
        bookedition: req.body.bookedition,
        year: new Date(req.body.year),
        course: req.body.course,
        author: req.body.author,
        semester: req.body.semester,
        pdffiles: writeStream.id,
      },
      (err) => {
        if (err) throw err;
      }
    );
    await book.save();
    res.render('admin-upload', {
      login: req.user,
      books: 'full',
      bookname: req.body.bookname,
    });
  } catch (err) {
    console.log('Duplication key error');
    gfs.s._filesCollection.deleteOne({ _id: writeStream.id });
    // db['fs.files'].remove({ _id: writeStream.id });
    // db['fs.chunks'].remove({ _id: writeStream.id });
    // render and put flash message of error
  }
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
