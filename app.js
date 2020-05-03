const express = require('express');

const app = express();
//const cors = require('cors');
const fileupload = require('express-fileupload');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const userreg = require('./models/userreg');

// mongodb
mongoose.connect('mongodb://localhost:27017/onlinetextbookdbs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// cors
//app.use(cors());
// bodyparser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// EJS
app.set('view engine', 'ejs');

// sessions
app.use(
  session({
    secret: 'its a secret',
    resave: false,
    saveUninitialized: false,
  })
);

// fileupload
app.use(fileupload());
// passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.serializeUser(userreg.serializeUser());
passport.deserializeUser(userreg.deserializeUser());
passport.use(
  new LocalStrategy({ usernameField: 'email' }, userreg.authenticate())
);

// routes
app.use('/users', require('./routes/user'));
app.use('/', require('./routes/index'));

// Setting up dynamic PORT env variable
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
