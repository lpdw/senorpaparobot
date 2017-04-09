var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var cors = require('cors');
var swig = require('swig');

var APIError = require('./lib/apiError');
var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var login = require('./routes/login');
var logout = require('./routes/logout');
var products = require('./routes/products');
var command = require('./routes/command');

var passport = require('passport');
var authentication = require('./services/authentication');

var app = express();

app.use(cors());
// utilisation du moteur de swig pour les .html
app.engine('html', swig.renderFile);
// utiliser le moteur de template pour les .html
app.set('view engine', 'html');
// dossier des vues
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sess = {
    secret: 'senorpaparobot-api',
    cookie: {},
    resave: false,
    saveUninitialized: true
};
app.use(session(sess));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    next();
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(authentication.senorPapaRobotLocalStrategy());

app.use(passport.initialize());
app.use(passport.session());

const verifyAuth = (req, res, next) => {
    res.locals.userLogged = false;
    if (req.originalUrl === '/signup' || req.originalUrl === '/login') {
        return next();
    }
    if (req.get('authorization') === 'lpdw-2016') {
        res.locals.userLogged = true;
        return next();
    }
    if (req.isAuthenticated()) {
        res.locals.userLogged = true;
        return next();
    }
    if (req.accepts('text/html')) {
        return res.redirect('/login');
    }
    if (req.accepts('application/json')) {
        res.set('Location', '/login');
        return res.status(401).send({err: 'User should be logged'});
    }
};
app.all('*', verifyAuth);

app.use('/', index);
app.use('/users', users);
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/products', products);
app.use('/command', command);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
    if (req.accepts('text/html')) {
        return res.render('error');
    }
    res.send(res.locals.message);
});

module.exports = app;
