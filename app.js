let express       = require('express');
let path          = require('path');
let favicon       = require('serve-favicon');
let logger        = require('morgan');
let cookieParser  = require('cookie-parser');
let bodyParser    = require('body-parser');
let debug         = require('debug');
let passport      = require('passport');
let session       = require('express-session');
let helmet        = require('helmet');
let cors          = require('cors');

let passportCfg   = require('./config/passport');
let router        = require('./router');

let port          = process.env.PORT || '3000';

let app           = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('env', 'development');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use(cors({
  origin: true,
  preflightContinue: true,
  maxAge: 600
}));

passport.use('local', passportCfg.local);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
passport.serializeUser(passportCfg.serializeUser);

passport.deserializeUser(passportCfg.deserializeUser);
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(port);
  debug('Express started on port %s', port);
}
