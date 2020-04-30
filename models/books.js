const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const url = 'mongodb://localhost:27017/onlinetextbookdbs';

// setup mongoose
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('Connected Successfully');
  const gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

// book schema
// validation
const bookschema = new mongoose.Schema({
  bookname: {
    required: true,
    type: String,
  },
  bookedition: {
    required: true,
    type: String,
  },
  year: {
    required: true,
    type: Date,
  },
  course: {
    required: true,
    type: String,
  },
  semester: {
    required: true,
    type: String,
  },
  addedAt: {
    required: true,
    type: Date,
    default: Date.now,
  },
  pdffiles: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

// unique values => combination of bookname and bookedition
bookschema.index({ bookname: 1, bookedition: 1 }, { unique: true }); // validation

// setup gridfs storage engine
const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads',
        };
        return resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage, limits: { fieldSize: 50 * 1024 * 1024 } });

// eslint-disable-next-line new-cap
const books = new mongoose.model('books', bookschema);

module.exports = { books, upload };
