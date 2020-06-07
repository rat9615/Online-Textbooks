const Books = require('../models/books');
// retrieve Author's names
module.exports = (req, res, done) => {
  Books.find({}, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.locals.name = data.sort();
    return done();
  }).distinct('author');
};
