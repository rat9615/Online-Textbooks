const express = require('express');

const app = express();

const passport = require('passport');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const LocalStrategy = require('passport-local').Strategy;
const userreg = require('./models/userreg');

// static
app.use(express.static(`${__dirname}/node_modules`));
// bodyparser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// flash
app.use(flash());

// Favicon
app.use(
  // eslint-disable-next-line no-undef
  favicon(path.join(__dirname, './public/img', 'onlinetb_favi.ico'))
);

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
// cookies
app.use(cookieParser());

// passport
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

// socket server
io.on('connection', (socket) => {
  console.log(`Established connection ${socket.id}`);

  socket.on('emit', (data) => {
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log(`Disconnected connections ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
