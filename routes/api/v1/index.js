const express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Define Route
const UserRouter = require('./ApiUserRoute');
router.use('/api', UserRouter);
//--------------------------------------------------------------------------------------------

module.exports = router;
