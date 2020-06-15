const express = require('express');

const app = express();

require('dotenv').config();

const passport = require('passport');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const server = require('http').Server(app);

const LocalStrategy = require('passport-local').Strategy;
const userreg = require('./models/userreg');

// MongoDB Atlas Connection String from environment variables
const { ATLAS_URI } = process.env;

// static
app.use('/public', express.static('public'));
app.use(
  // eslint-disable-next-line no-undef
  favicon(path.join(__dirname, './public/img', 'onlinetb_favi.ico'))
);

// bodyparser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// cookies
app.use(cookieParser());

// flash
app.use(flash());

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

// MongoDB Setup and Connection
mongoose.connect(ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('OnlineTextbooksDB Connected Successfully');
});

// passport
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.serializeUser(userreg.serializeUser());
passport.deserializeUser(userreg.deserializeUser());
passport.use(
  new LocalStrategy({ usernameField: 'email' }, userreg.authenticate())
);

// disable cache
app.use((req, res, done) => {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  done();
});

// routes
app.use('/users', require('./routes/user'));
app.use('/', require('./routes/index'));

// handle 404 and 500 error
app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((req, res) => {
  res.status(500);
  res.render('500');
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
