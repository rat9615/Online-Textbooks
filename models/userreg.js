const mongoose = require('mongoose');
const passmongoose = require('passport-local-mongoose');

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
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
  },
  username: {
    type: String,
    required: true,  //Check for already existing users   //think if unique email is to be implemented
  },
  usn: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: String,
    required: true,
  },


});

userSchema.plugin(passmongoose);
// eslint-disable-next-line new-cap
const userreg = new mongoose.model('userreg', userSchema);

module.exports = userreg;
