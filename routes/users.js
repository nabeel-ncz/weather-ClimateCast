const { response } = require('express');
var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();


router.get('/', async(req, res)=> {
  res.render('index')
});

module.exports = router;
