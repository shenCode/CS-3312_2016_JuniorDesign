var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
require('../models/schedule');
var schedule = mongoose.model('schedule');


/* GET users listing. */
router.get('/:email', function(req, res, next) {
  schedule.find({email: req.params.email}, function(err, schedules){
    if (err) {
      next(err);
    } else {
      res.json({"schedules" : schedules});

    }
  });
});

router.get('/:email/:forVersionID', function(req, res, next) {
  //console.log("in getting versionIDS");
  
  // just return 0
  var tmp = [];
  tmp.push(0);
  res.json({"arr": tmp});
  return;
  schedule.find({email: req.params.email}, function(err, schedules){
    if (err) {
      next(err);
      //console.log(err);
    } else if (schedules.length < 1) {
      var tmp = [];
      tmp.push(0);
      res.json({"arr": tmp});
      return;
    } else {
      //console.log("schedules are  " + schedules === null);
      //console.log("server getting version IDs, no error");
      var arr = [];
      //console.log("schedules length:  " + schedules.length);
      for (var i = 0; i < schedules.length; i++) {
        //console.log(schedules[i].versionId);
        arr.push(schedules[i].versionId);
      }
      arr.sort();
      var ret = [];
      var l = 0;
      var r = l;
      for (var i = 0; i < arr.length; i++) {
        r = arr[i];
        for (var j = l; j < r; j++) {
          ret.push(j);
        }
        l = r + 1;
      }
      ret.push(arr[arr.length - 1] + 1);
      for (var i = 0; i < ret.length; i++) {
        ret[i] = JSON.parse(ret[i]);
      }
      //console.log(ret);
      res.json({"arr": ret});
      //res.send(200);
      


    }
  });
});

// 401: Not Authorized
router.post('/:email', function(req, res, next) {
  // var test = new schedule({"semester":"201601","email":"test1@gmail.com","courses":[{"name":"Intro Discrete Math Cs","ref":"CS2050","section":{"section_id":"A1","ref_num":25885,"location":{"0":"Klaus 1443","1":"Klaus 1443","2":"Klaus 1443","3":"Instr Center 109"},"instructor":"Monica   Sweat","timeSlots":{"0":{"day":"M","start_time":785,"end_time":835},"1":{"day":"W","start_time":785,"end_time":835},"2":{"day":"F","start_time":785,"end_time":835},"3":{"day":"W","start_time":905,"end_time":985}},"seat":{"capacity":50,"actual":28,"remaining":22}}}],"versionId":1});
  // test.save()
  schedule.find({email: req.params.email}).remove().exec();
  var schedules = req.body.schedules;
  console.log("printing received schedules");
  for (var i = 0; i < schedules.length; i++) {
    //console.log(s);
    //console.log(s.locations.length);
    //console.log(s.courses[0].locations);
    console.log(schedules[i]);
    var tmp = new schedule(JSON.parse(schedules[i]));
    tmp.save();
  }
  res.sendStatus(200);
});



module.exports = router;
