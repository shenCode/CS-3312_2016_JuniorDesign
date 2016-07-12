var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
require('../models/user');
var user = mongoose.model('user');


/* GET users listing. */
// return all users
router.get('/', function(req, res, next) {
  user.find(function(err, users){
    if (err) {
      next(err);
    } else {
      res.json(users);
    }
  });
});


// 401: Not Authorized
router.post('/:email', function(req, res, next){
	user.findOne({email: req.params.email}, function(err, auser){
		if (err) {
			next(err);
		} else {
      if (auser === null) {
        res.sendStatus(401);
        return;
      }
      if (auser["password"] === req.body.password) {
        res.json(auser);
        //res.sendStatus(200); //OK
      } else {
        res.sendStatus(401); 
      }
		}
	});
});

// PUT a new user on mongodb or return err if existed
// 200: SUCCESS
// 401: user already existed 
router.put('/:email', function(req, res, next){
  var newuser = new user(req.body);
  console.log(req.body)
  user.findOne({email: newuser.email}, function(err, auser){
    if (err) {
      next(err);
    } else {
      if (!auser) {
        newuser.save();
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  });
});

//
router.post('/:email', function(req, res, next){
  user.findOne({email: req.params.email}, function(err, auser){
    if (err) {
      next(err);
    } else {
      var auser = new user(req.body);
      auser.save();
    }
  });
});

module.exports = router;
