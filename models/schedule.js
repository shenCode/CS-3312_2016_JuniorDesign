var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var timeSlot = new Schema({
  day : String, //could be M, T, W, TH, F
  start_time: Number, // could be 655
  end_time: Number // could be 755, in 24hr format
});

var seat = new Schema({
  capacity : Number,
  actual : Number,
  remainging: Number
});

//section
var sec = new Schema({
  section_id : String, //could be section A, B, C
  ref_num : Number, // course numer, 21958
  location : {},
  instructor : String,
  timeSlots: {},
  seats : seat
});

var course = new Schema({
  name : String, // intro to HPC
  ref : String, // CX4220
  section : sec
})

var schedule = new Schema({
  semester : String, // fall 2016
  email: String, // user
  courses : [course],
  versionId: Number
});

mongoose.model('schedule', schedule)