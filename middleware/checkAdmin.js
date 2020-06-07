// Check admin autthorization
module.exports = (req, res, done) => {
  if (req.user.isAdmin === true) {
    return done();
  }
  return res.redirect('/');
};
