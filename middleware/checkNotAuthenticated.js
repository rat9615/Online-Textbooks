// Check not authenticated
module.exports = (req, res, done) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return done();
};
