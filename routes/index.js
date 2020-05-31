const express = require('express');

const router = express.Router();
const fileupload = require('express-fileupload');
const passport = require('passport');
const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const fs = require('fs');
const path = require('path');
const { PDFImage } = require('pdf-image');
const Books = require('../models/books');
const Userreg = require('../models/userreg');
const Requestbook = require('../models/requestbook');

// Static
router.use(express.static('public'));
router.use(fileupload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// mongoose connection => only for gridfs
const url = 'mongodb://localhost:27017/onlinetextbookdbs';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Gridfs Connection
const db = mongoose.connection;
let gfs;
let Grid;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('Connected Successfully');
  Grid = grid(db.db, mongoose.mongo);
  gfs = new mongoose.mongo.GridFSBucket(db.db);
});

// Check Authentication
function isAuthenticated(req, res, done) {
  if (req.isAuthenticated()) {
    return done();
  }
  return res.redirect('/users/login');
}

// check if admin
function checkAdmin(req, res, done) {
  if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
    return done();
  }
  return res.redirect('/');
}

// retrieve Author's names
function authorName(req, res, done) {
  Books.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.locals.name = data.sort();
    return done();
  }).distinct('author');
}
// check not authenticated also if user is logged in he should not come back to register

// Index
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
    // to get latest added books
    Books.find({}, (err, data) => {
      return res.render('index', { login: req.user, cover: data });
    })
      .sort({ _id: -1 })
      .limit(4);
    return done;
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
    // return res.render('index', { login: req.user });
    // to get latest added books
    Books.find({}, (err, data) => {
      return res.render('index', { login: req.user, cover: data });
    })
      .sort({ _id: -1 })
      .limit(4);
  }
);
// Download books
router.get('/download-books', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('download', { login: req.user, user: 'admin' });
    }
    return res.render('download', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// Branch
router.get('/branch', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('branch', {
        login: req.user,
        user: 'admin',
      });
    }
    return res.render('branch', {
      login: req.user,
      user: 'regular',
    });
  }
  return res.redirect('/users/login');
});

// Semester
router.get('/semester', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('semesters', { login: req.user, user: 'admin' });
    }
    return res.render('semesters', { login: req.user, user: 'regular' });
  }
  return res.redirect('/users/login');
});

// Authors
router.get('/author', authorName, (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
      return res.render('authors', {
        login: req.user,
        user: 'admin',
        name: res.locals.name,
      });
    }
    return res.render('authors', {
      login: req.user,
      user: 'regular',
      name: res.locals.name,
    });
  }
  return res.redirect('/users/login');
});

// Admin-Actions Upload books
router.get('/upload-books', isAuthenticated, (req, res) => {
  if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
    return res.render('admin-upload', { login: req.user, books: 'empty' });
  }
  return res.redirect('/');
});

// Admin-Actions Delete books
router.get('/delete-books', isAuthenticated, (req, res, done) => {
  if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
    Books.find({}, (err, data) => {
      res.render('admin-delete', {
        login: req.user,
        displayBooks: data,
      });
    });
    return done; // should be a callback done()
  }
  return res.redirect('/');
});
// filepond upload to server
router.post('/uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  const filename = req.files.filepond;
  let imagename = filename.name;
  imagename = imagename.toString().slice(0, -4);

  // validate if file does not fall into uploads folder
  req.files.filepond.mv(
    path.join(__dirname, '../public/uploads', filename.name),
    (err) => {
      if (err) throw err;
    }
  );

  // convert  pdf to image thumbnail
  const pdfImage = new PDFImage(
    path.join(__dirname, '../public/uploads', filename.name),
    {
      convertOptions: {
        '-resize': '300x300',
        '-quality': '100',
        '-background': 'white',
        '-layers': 'flatten',
      },
    }
  );

  pdfImage.convertPage(0).then(() => {
    console.log('Image uploaded');
  });

  req.flash('filename', filename.name);
  req.flash('imagename', `${imagename}-0.png`);

  // need some validation here incase file fails to upload
  res.send('File and image Uploaded!');
});

// filepond remove from server
router.delete('/remove', (req, res) => {
  let filename = req.flash('filename');
  let imagename = req.flash('imagename');
  filename = filename[0].toString();
  imagename = imagename[0].toString();

  // to remove file
  fs.unlinkSync(path.join(__dirname, '../public/uploads', filename), (err) => {
    if (err) {
      console.log(err);
    }
  });

  // to remove image
  fs.unlinkSync(path.join(__dirname, '../public/uploads', imagename), (err) => {
    console.log(err);
  });

  res.send('File and image deleted!');
});

// uploading books to mongodb
router.post('/upload-books', async (req, res) => {
  let filename = req.flash('filename');
  let imagename = req.flash('imagename');
  filename = filename[0].toString();
  imagename = imagename[0].toString();
  const writeStream = gfs.openUploadStream(filename);
  // validate => when upload file is not entered schema details should not be entered also
  // validate => when book name and edition already exists in database
  try {
    // uploading file => uploads
    fs.createReadStream(
      path.join(__dirname, '../public/uploads', filename),
      (err) => {
        if (err) console.log(err);
      }
    ).pipe(writeStream);
    // deleting file => uploads
    const book = new Books(
      {
        bookname: req.body.bookname, // validate in case user types same name but with spacing or changes capitalization
        bookedition: req.body.bookedition,
        year: new Date(req.body.year),
        course: req.body.course,
        author: req.body.author,
        semester: req.body.semester,
        pdffiles: writeStream.id,
        image: {
          data: fs
            .readFileSync(
              path.join(__dirname, '../public/uploads', imagename),
              (err) => {
                if (err) console.log(err);
              }
            )
            .toString('base64'),
          contentType: 'image/png',
        },
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
    const objId = new mongoose.Types.ObjectId(writeStream.id);
    Grid.remove({ _id: objId });
    res.send('Files deleted from gfs');
    // render and put flash message of error
  } finally {
    fs.unlinkSync(
      path.join(__dirname, '../public/uploads', imagename),
      (err) => {
        console.log(err);
      }
    );
    fs.unlinkSync(
      path.join(__dirname, '../public/uploads', filename),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
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

// view pdf books
router.get('/pdf/:name/:id', isAuthenticated, (req, res) => {
  // gfs.openDownloadStream({ _id: req.params.id }).pipe(res);
  const readstream = Grid.createReadStream({ _id: req.params.id });
  res.setHeader('Content-disposition', `filename= ${req.params.name}.pdf`);
  res.setHeader('Content-type', 'application/pdf');
  readstream.pipe(res);
});

// find books by branch
router.get('/branch/:course', isAuthenticated, (req, res) => {
  Books.find({ course: req.params.course }, (err, data) => {
    return res.render(
      path.join(__dirname, '../views/partials', 'searchResults.ejs'),
      { cover: data }
    );
  }).sort({ _id: -1 });
});

// find books by semester
router.get('/semester/:course/:semester', isAuthenticated, (req, res) => {
  Books.find(
    { course: req.params.course, semester: req.params.semester },
    (err, data) => {
      return res.render(
        path.join(__dirname, '../views/partials', 'searchResults.ejs'),
        { cover: data }
      );
    }
  ).sort({ _id: -1 });
});

// find books by author
router.get('/author/:author', isAuthenticated, (req, res) => {
  Books.find({ author: req.params.author }, (err, data) => {
    return res.render(
      path.join(__dirname, '../views/partials', 'searchResults.ejs'),
      { cover: data }
    );
  }).sort({ _id: -1 });
});

// autcomplete search
router.get('/search/books/:bookname', isAuthenticated, (req, res) => {
  Books.find(
    { bookname: { $regex: req.params.bookname, $options: 'i' } },
    (err, data) => {
      return res.json(data);
    }
  ).distinct('bookname');
});

// find books by name
router.get('/books/:bookname', isAuthenticated, (req, res) => {
  Books.find({ bookname: req.params.bookname }, (err, data) => {
    return res.render(
      path.join(__dirname, '../views/partials', 'searchResults.ejs'),
      { cover: data }
    );
  }).sort({ _id: -1 });
});

// Admin-Actions User Accounts
router.get('/user-accounts', isAuthenticated, (req, res, done) => {
  if (req.user.firstname === 'bmsce' && req.user.lastname === 'admin') {
    Userreg.find({}, (err, data) => {
      res.render('admin-user-accounts', {
        login: req.user,
        userAccounts: data,
      });
    });
    return done;
  }
  res.redirect('/');
});

// Get users data
router.get('/users/data', isAuthenticated, (req, res) => {
  Userreg.find({ firstname: { $ne: 'bmsce' } }, (err, data) => {
    return res.send({ data });
  });
});

// Get books data
router.get('/book-data/info', isAuthenticated, (req, res) => {
  Books.find({}, (err, data) => {
    return res.send({ data });
  });
});

module.exports = router;
