/*
 * sharedProperties:
 *  A service that store all the required data for schedule calculation and
 *  UI Interaction. The list below only contains the data that will be used
 *  outside the module.
 *  choosenCourses: 
 *      the courses that users chosen.
 *  schools: 
 *      available schools list received from CourseOff
 *  terms: 
 *      available terms list (school specified) from CourseOff
 *  majors: 
 *      available majors list (school, term specified) from CourseOff
 *  courses: 
 *      available courses list (school, term, major specified) from 
 *      CourseOff
 *  sections: 
 *      available sections list (school, term, major, course specified) 
 *      from CourseOff
 *  focusedCourse: 
 *      the course focused by user but not selected
 *  sectionDic: 
 *      the hashing table that use course Serial Number as key and 
 *      the section lists as value.
 *  readyToPick:
 *      a boolean variable to indicate whether user has a focused
 *      course or not. If yes, it will be set to true and means user
 *      can choose to pick this class.
 */
var app = angular.module('app');
app.service('sharedProperties', function(){
  var chosenCourses = [];
  var courseFindingList = {};
  var schools = [];
  var terms = [];
  var majors = [];
  var courses = [];
  var sections = [];
  var focusedCourse = [];
  var focusedSemester = {};
  var sectionDic = {};
  var readyToPick = false;
  var loginStatus = false;
  var schedules = [];
  // name of user logged in 
  var email = "";
  /*timeConstraint = [timeslot]:
    timeslot = {
      day : String,
      start_time : int(minute),
      end_time : int(minute)
    };
    day: String
      one of "M", "T", "W", "TH" and "F" 
    start_time: int(minute)
      the start time that no course will be assigned before
    end_time: int(minute)
      the end time that no course will be assigned later than*/
  var Mon = {
    day : "M",
    start_time : 0,
    end_time : 1440
  };
  var Tues = {
    day : "T",
    start_time : 0,
    end_time : 1440
  };
  var Wed = {
    day : "W",
    start_time : 0,
    end_time : 1440
  };
  var Thur = {
    day : "TH",
    start_time : 0,
    end_time : 1440
  };
  var Fri = {
    day : "F",
    start_time : 0,
    end_time : 1440
  };
  var timeConstraint = [Mon, Tues, Wed, Thur, Fri];
  // database variable
  var versionIDs = [];

  return {
    getChosenCourses: function() {
      return chosenCourses;
    },
    setChosenCourses: function(val) {
      chosenCourses = val;
    },
    getCourseFindingList: function() {
      return courseFindingList;
    },
    setCourseFindingList: function(val) {
      courseFindingList = val;
    },
    getCourseSections: function(val) {
      return courseFindingList[val];
    },
    getSchools: function() {
      return schools;
    },
    setSchools: function(val) {
      schools = val;
    },
    getTerms: function() {
      return terms;
    },
    setTerms: function(val) {
      terms = val;
    },
    getMajors: function() {
      return majors;
    },
    setMajors: function(val) {
      majors = val;
    },
    getCourses: function() {
      return courses;
    },
    setCourses: function(val) {
      courses = val;
    },
    getSections: function() {
      return sections;
    },
    setSections: function(val) {
      sections = val;
    },
    getFocusedCourse: function() {
      return focusedCourse;
    },
    setFocusedCourse: function(val) {
      focusedCourse = val;
    },
    getSectionDic: function() {
      return sectionDic;
    },
    setSectionDic: function(val) {
      sectionDic = val;
    },
    updateSectionDic: function(k, v) {
      sectionDic[k] = v;
    },
    deleteSectionDicWithVal: function(val) {
      delete sectionDic[val];
    },
    getReadyToPick: function() {
      return readyToPick;
    },
    setReadyToPick: function(val) {
      readyToPick = val;
    },
    getLoginStatus: function() {
      return loginStatus;
    },
    setLoginStatus: function(val) {
      loginStatus = val;
    },
    setTimeConstraint: function(val) {
      console.log(timeConstraint);
      timeConstraint = val;
    },
    addTimeSlotToConstraint: function(val) {
      timeConstraint.push(val);
    },
    getTimeConstraint: function() {
      return timeConstraint;
    },
    setTimeConstraintByDay: function(ind, val1, val2) {
        timeConstraint[ind].start_time = val1;
        timeConstraint[ind].end_time = val2;
    },
    setSchedules: function(val) {
      schedules = val;
    },
    getSchedules: function() {
      return schedules;
    },
    addSchedules: function(val) {
      for (var ind = 0; ind < val.length; ind++) {
        schedules.unshift(val[ind]);
      }
    },
    emptySchedules: function() {
      schedules.length = 0;
    },
    setFocusedSemester: function(val) {
      focusedSemester = val;
    },
    getFocusedSemester: function() {
      return focusedSemester;
    },
    setEmail: function(val) {
      email = val; 
    }, 
    getEmail: function() {
      return email;
    },
    removeScheduleByID: function(val) {
      schedules.splice(val, 1);
    },
    getVersionIDs: function() {
      return versionIDs;
    },
    setVersionIDs: function(val) {
      if (val.length < 1) return;
      versionIDs = [];
      for (var i = 0; i < val.length; i++) {
        versionIDs[i] = val[i];
      }
    }
  }
});
