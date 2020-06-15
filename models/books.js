const mongoose = require('mongoose');

// book schema
// validation
const bookschema = new mongoose.Schema({
  bookname: {
    type: String,
    required: true,
    trim: true,
  },
  bookedition: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
    trim: true,
  },
  pdffiles: {
    type: mongoose.Schema.Types.ObjectId,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

// unique values => combination of bookname and bookedition
bookschema.index({ bookname: 1, bookedition: 1 }, { unique: true }); // validation

// eslint-disable-next-line new-cap
const books = new mongoose.model('books', bookschema);

// module.exports = { books, upload };
module.exports = books;
