const express = require('express');
const app = express();
const port = 3003;
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const db = require('./config/mongoose');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

app.use(methodOverride('_method'));

const passport = require('passport');
const passportLocal = require('./config/passport');

// Set up EJS and Express Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);

// Add the session middleware
app.use(
    session({
        name: 'learn',
        secret: 'something',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://rahulverma9559:pWfzCo7RU2pSSCir@cluster0.7sa8r47.mongodb.net/?retryWrites=true&w=majority',
            autoRemoveInterval: 24 * 60, // Remove expired sessions once a day
        }),
    })
);

// ...

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});