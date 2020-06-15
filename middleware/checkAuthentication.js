// Check Authentication
module.exports = (req, res, done) => {
  if (req.isAuthenticated()) {
    return done();
  }
  return res.redirect('/users/login');
};
