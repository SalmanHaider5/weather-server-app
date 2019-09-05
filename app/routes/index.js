var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let response = {
    'statusCode':'200',
    'message':'Health check ok'
  }
  res.send(response);
});

module.exports = router;
