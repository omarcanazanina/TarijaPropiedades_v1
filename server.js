// load the things we need
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(expressSession.Store);


const sequelize = require('./libs/sequelize')
const authRoute = require('./routes/auth')
const mapsRoute = require('./routes/maps')

const sequelizeSessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
  });
var app = express();
app.use(cors())
// set the view engine to ejs

app.use(cookieParser())
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'some-secret',
    store: sequelizeSessionStore,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
    saveUninitialized: false,
}));
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));
// use res.render to load up an ejs view file
app.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
  });
// index page 
app.get('/',async function(req, res) {
     const data = await sequelize.models.User.findAll()
        console.log(data, 'data')
/*req.session.destroy(err=>{
    console.log(err)
})*/
    console.log(req.session.count)

    res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.use('/auth',authRoute);
app.use('/maps',mapsRoute);
const port = process.env.PORT || 3000;
app.listen(port);
console.log(port +' is the magic port');
