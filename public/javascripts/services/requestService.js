 /*  To use requestService:
 *      inject it into dependency, call the corresponding method by
 *      using:
 *          "requestService.{name of the method}()"
 *      Ex. ng-change='requestService.requestOnSchools()'
 *
 *  A Service that provides you the method to request data from
 *  CourseOff.com, the data in dataService will correspondingly
 *  updated. In the sense of two way data binding, bind the data
 *  in dataService to the interface and call the method in requestService
 *  will achieve the two way data binding model.
 *  
 *  requestOn[Load, Schools, Terms, Majors, Courses]:
 *      All these methods work in similar logic, that request the data
 *      from courseOff and update the data in dataService when the certain
 *      field is determined except requestOnLoad should be called at the
 *      very first to fill in the list of School.
 *  pick/removeClass:
 *      These two methods updated the chosen classes of users in the memory
 *      call pickClass will update dataService.choosenCourses by pushing
 *      dataService,focusedCourse in the dataService.
 * 
 *      removeClass will have to take in the index of the course in the
 *      list of data.choosenCourses. Achieve this by using ng-value and $index
 */
var app = angular.module('app');
app.service('requestService', ['requestCourseOff', 'sharedProperties', 'autoScheduler', 
    function(requestCourseOff, sharedProperties, autoScheduler){
    var _this = this;
    this.requestOnLoad = function() {
        requestCourseOff([], function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].display = data[i].name;
            }
            sharedProperties.setSchools(data);
        });
    };
    this.requestOnSchools = function() {
        requestCourseOff([this.schoolName], function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].display = data[i].semester + ' ' +Math.floor(data[i].ident / 100);
            }
            sharedProperties.setTerms(data);
            sharedProperties.setMajors([]);
            sharedProperties.setCourses([]);
        });
    };
    this.requestOnTerms = function() {
        var _this = this;
        requestCourseOff([this.schoolName, this.termName], function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].display = data[i].ident + '-' + data[i].name;
            }
            sharedProperties.setFocusedSemester(_this.termName);
            sharedProperties.setMajors(data);
            sharedProperties.setCourses([]);
        });
    };
    this.requestOnMajors = function() {
        requestCourseOff([this.schoolName, this.termName, this.majorName], function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].display = data[i].ident + '-' + data[i].name;
                data[i].classTag = _this.majorName + data[i].ident;
                var l = sharedProperties.getCourseFindingList();
                l[data[i].ident] =data[i];
                sharedProperties.setCourseFindingList(l);
            }
            sharedProperties.setCourses(data);
        });
    };
    this.requestOnCourses = function() {
        sharedProperties.setReadyToPick(true);
        sharedProperties.setFocusedCourse(sharedProperties.getCourseSections(this.courseName));
        console.log(sharedProperties.getFocusedSemester());
        console.log(sharedProperties.getEmail());
        console.log(sharedProperties.getLoginStatus());
        requestCourseOff([this.schoolName, this.termName, this.majorName, this.courseName], function(data) {
            sharedProperties.setSections(data);
        });
    };
    this.updateTimeConstraints = function(timeslot) {
        sharedProperties.addTimeSlotToConstraint(timeslot);
        console.log(sharedProperties.getTimeConstraint);
    }
    this.pickClass = function() {
        var chosenCourses = sharedProperties.getChosenCourses();
        if (chosenCourses.indexOf(sharedProperties.getFocusedCourse()) == -1) {
            chosenCourses.push(sharedProperties.getFocusedCourse());
            sharedProperties.setChosenCourses(chosenCourses);
            sharedProperties.updateSectionDic(sharedProperties.getFocusedCourse().classTag, sharedProperties.getSections());
        }
    };
    this.removeClass = function(ind) {
        sharedProperties.deleteSectionDicWithVal(sharedProperties.getChosenCourses()[ind].classTag);
        var chosenCourses = sharedProperties.getChosenCourses();
        chosenCourses.splice(ind, 1);
        sharedProperties.setChosenCourses(chosenCourses);
    };
}]);