const mongoose = require('mongoose');
const userreg = require('./userreg');

// setup mongoose
mongoose.connect('mongodb://localhost:27017/onlinetextbookdbs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('Connected Successfully');
});

// user registration schema
const requestSchema = new mongoose.Schema({
  name_of_the_book: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  year_of_publication: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
  },
  name_of_author: {
    type: String,
    required: true,
  },
  Edition: {
    type: String,
    required: true,
  },
  addedAt: {
    required: true,
    type: Date,
    default: Date.now,
  },
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userreg,
  },
  usn: {
    type: String,
    required: true,
  },
});
// eslint-disable-next-line new-cap
const bookreq = new mongoose.model('bookreq', requestSchema);

module.exports = bookreq;
