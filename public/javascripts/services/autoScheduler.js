var app = angular.module('app');
app.service('autoScheduler', ['sharedProperties', function(sharedProperties){
    // var sectionDic = sharedProperties.getSectionDic();

    var generateSchedules = function() {
        var sectionDic = sharedProperties.getSectionDic();
        var timeConstraint = sharedProperties.getTimeConstraint();
        var schedules = [];
        var courses = Object.keys(sectionDic);
        var numOfCourses = courses.length;
        var numOfSections = [];     // the array storing # of sections of each course
        for (var i = 0; i < numOfCourses; i++) {
            numOfSections[i] = sectionDic[courses[i]].length;
        }
        var iterStack = [];         // the stack storing the section index of scheduled courses
        var curSchedule = [];       // the schedule storing the information of scheduled courses
        var curCourseIdx = 0;       // the current course index we are considering
        var curSectionIdx = 0;      // the current section index of the current course
        var bestScheduleSoFar = []; // the best schedule so far if it is impossible to schedule all courses
        var complete = (numOfCourses == 0);
        while (!complete) {
            var curCourse = courses[curCourseIdx];
            var curSection = sectionDic[curCourse][curSectionIdx];
            // the current section can fit in the current schedule
            if (!isTimeConstraintConflict(timeConstraint, curSection) && !isCourseConflict(curSchedule, curSection)) {
                iterStack[curCourseIdx] = curSectionIdx;
                curSchedule[curCourse] = curSection;
                if ((curCourseIdx + 1) == numOfCourses) {
                    schedules.push(jQuery.extend(true, {}, curSchedule));
                    iterStack.splice(curCourseIdx, 1);
                } else {
                    curCourseIdx += 1;
                    curSectionIdx = -1; // prepare for the update
                }
            }
            // the current sction cannot fit in the current schedule
            var carryIn = 1;
            while (carryIn == 1 && curCourseIdx >= 0) {
                curSectionIdx += carryIn;
                if (curSectionIdx == numOfSections[curCourseIdx]) {
                        // update the best schedule so far if necessary
                        if (curCourseIdx > Object.keys(bestScheduleSoFar).length) {
                            bestScheduleSoFar = curSchedule;
                        }
                        curSectionIdx = iterStack.splice(curCourseIdx - 1, 1)[0];
                        // curSchedule.splice(curCourseIdx - 1, 1);
                        curCourseIdx -= 1;
                } else {
                    carryIn = 0;
                }
            }
            // searching is complete if no more back tracking
            if (curCourseIdx < 0) {
                complete = true;
            } else {
                curSchedule = [];
                for (var i = 0; i < Object.keys(iterStack).length; i++) {
                    curSchedule[courses[i]] = sectionDic[courses[i]][iterStack[i]];
                }
            }
        }
        if (Object.keys(schedules).length == 0 && Object.keys(bestScheduleSoFar).length > 0) {
            schedules.push(bestScheduleSoFar);
        }
        return schedules;
    };

    var formalizeSchedules = function(roughSchedules) {
        chosenCourses = sharedProperties.getChosenCourses();
        formalizedSchedules = [];
        for (var i = 0; i < Object.keys(roughSchedules).length; i++) {
            curSchedule = roughSchedules[i];
            var scheduleObj = {
                semester: sharedProperties.getFocusedSemester(),
                email: sharedProperties.getEmail(),
                courses : []
            };
            for (var j = 0; j < Object.keys(curSchedule).length; j++) {
                curCourse = chosenCourses[j];
                var courseName = curCourse.name;
                var courseTag = curCourse.classTag;
                var curSection = curSchedule[courseTag];
                var loc = [];
                var times = [];
                for (var k = 0; k < curSection.timeslots.length; k++) {
                    loc[k] = curSection.timeslots[k].location;
                    times[k] = {
                        day : curSection.timeslots[k].day,
                        start_time : curSection.timeslots[k].start_time,
                        end_time : curSection.timeslots[k].end_time
                    };
                }
                var sec = {
                    section_id : curSection.ident,
                    ref_num : curSection.call_number,
                    location : jQuery.extend(true, {}, loc),
                    instructor : (curSection.instructor ? (curSection.instructor.fname + " " + curSection.instructor.lname) : ""),
                    timeSlots : jQuery.extend(true, {}, times),
                    seat: jQuery.extend(true, {}, curSection.seats),
                };
                var course = {
                    name : courseName,
                    ref : courseTag,
                    section : jQuery.extend(true, {}, sec)
                };
                scheduleObj.courses[j] = jQuery.extend(true, {}, course);
            }
            // formalizedSchedules[i] = jQuery.extend(true, {}, ScheduleJSON);
            // var ScheduleJSON = JSON.stringify(ScheduleObj);
            formalizedSchedules[i] = scheduleObj;
        }
        return formalizedSchedules;
    };

    var isTimeConstraintConflict = function(timeConstraint, section) {
        var timeslots = section.timeslots;
        for (var i = timeslots.length - 1; i >= 0; i--) {
            for (var j = timeConstraint.length - 1; j >= 0; j--) {
                if (timeslots[i].day == timeConstraint[j].day) {
                    if (timeslots[i].end_time > timeConstraint[j].end_time || timeslots[i].start_time < timeConstraint[j].start_time) {
                        return true;
                    }
                }
            }
        }
        return false;
    };


    var isCourseConflict = function(schedule, section) {
        keys = Object.keys(schedule);
        for (var i = 0; i < keys.length; i++) {
            curSection = schedule[keys[i]];
            timeslotsA = curSection.timeslots;
            timeslotsB = section.timeslots;
            for (var j = timeslotsA.length - 1; j >= 0; j--) {
                for (var k = timeslotsB.length - 1; k >= 0; k--) {
                    if (isOverlap(timeslotsA[j], timeslotsB[k])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    var isOverlap = function(timeslotA, timeslotB) {
        if (timeslotA.day == timeslotB.day) {
            if ((timeslotA.start_time >= timeslotB.start_time && timeslotA.start_time <= timeslotB.end_time) || (timeslotA.end_time >= timeslotB.start_time && timeslotA.end_time <= timeslotB.end_time)) {
                return true;
            }
        }
        return false;
    };

    this.getSchedules = function() {
        roughSchedules = generateSchedules();
        formalizedSchedules = formalizeSchedules(roughSchedules);
        console.log(formalizedSchedules);
        return formalizedSchedules;
    };
}]);