//import environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//server configuration
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const favicon = require('serve-favicon');
const path = require('path');

//create the app
const app = express();
app.use('/public', express.static('public'));
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

require('./middleware/passport')(passport);
const hbs = require('./helpers/handelbars.js')(exphbs);

//connect to the database
const DB = require('./config/db');
mongoose
    .connect(DB.mongoURI, { useNewUrlParser: true }) //to remove depreciation warning
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
mongoose.set('useCreateIndex', true); //to remove depreciation warning
var conn = mongoose.connection;

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// required for passport
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use((req, res, next) => {
    res.locals.user = req.user; // This is the important line
    next();
});
app.use(flash()); // use connect-flash for flash messages stored in session

//flash
app.use(flash());

//Handlebars middleware
// app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//CSS
app.use('/public', express.static('public'));

//Global variables
app.use(function(req, res, next) {
    res.locals.req = req;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; //to tell if logged in
    next();
});

// routes
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`); //backticks for variable use
});
