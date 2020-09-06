var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // res.render('index', { data: {"test": [1,2,3]} });
  res.redirect('/digs');
});

module.exports = router;
