var mongoose = require('mongoose');
var mockUsers = require('./jsons/mockUsers.json');
var mockSchedule = require('./jsons/mockSchedule.json');

var fillInMockData = function initializeDB() {
  mongoose.connect('mongodb://127.0.0.1:27017/test');
  var db = mongoose.connection;
  db.once('open', function(){
    initializeUsersInDB();
    //initializeSchedulesInDB();
  });
  
}
function initializeUsersInDB() {
  mongoose.model('user').find(function(err, users){
    if (users.length < 1) {
      console.log("collection users does not exist");
      var users = mongoose.model('user');
      users.collection.insert(mockUsers, function(err){
        if (err) {
          console.log("error in adding mock users: " + err);
        } 
      });    
    }
  });
}

function initializeSchedulesInDB() {
  mongoose.model('schedule').find(function(err, users){
    if (users.length < 1) {
      console.log("collection schedules does not exist");
      var schedules = mongoose.model('schedule');
      schedules.collection.insert(mockSchedule, function(err){
        if (err) {
          console.log("error in adding mock schedules: " + err);
        } 
      });    
    }
  });
}

module.exports = {
  start: fillInMockData
}