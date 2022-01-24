var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('pages/auth/login')
}).get('/register', function(req, res) {
    res.render('pages/auth/register')
});
module.exports = router;