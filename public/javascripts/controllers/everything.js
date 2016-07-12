

var app = angular.module('app');

app.controller('everything', ['$scope','sharedProperties', 'requestService', 'autoScheduler', 'scheduleService',
function($scope, sharedProperties, requestService, autoScheduler, scheduleService) {
  $scope.sharedProperties = sharedProperties;
  $scope.requestService = requestService;
  $scope.autoScheduler = autoScheduler;
  $scope.scheduleService = scheduleService;
  requestService.requestOnLoad();
  var vm = this;
  
    vm.displayCourse = false;
    vm.displaySection = false;

    $scope.constraint = {day: 'M', s: '0', e: '1440'};

    vm.showNextCourse = function() {
        vm.displayCourse = true;
        requestService.requestOnMajors();
    };

    vm.showSections = function() {
        vm.displaySection = true;
        requestService.requestOnCourses();
    }

    vm.alert = function() {
        alert("Hello World");
    }

    vm.displayStyle = [];
    vm.allSections = [];
    vm.relateSec = [];

    vm.changeState2 = function(st) {
      if (vm.allSections.indexOf(st) == -1) {
        return;
      }
      for (var i = 0; i < vm.relateSec[st].length; i++) {
        var s = vm.relateSec[st][i];
        if (vm.displayStyle[s]['state'] == false) {
          vm.displayStyle[st]['state'] = true;
        }
        else {
          vm.displayStyle[s]['state'] = false;
        }
      }
    }

    vm.changeState = function(sec) {
        console.log(sec);
        var shortid = sec.call_number.toString();
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var j = 0; j < 6; j++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        var rls = [];
        var v = false;
        for (var i = 0; i < sec.timeslots.length; i++) {
          var cur = sec.timeslots[i];
          var tmpid = shortid + sec.timeslots[i].day + cur.start_time.toString();
          rls.push(tmpid);
          if (vm.allSections.indexOf(tmpid) != -1) {
            v = true;
            if (vm.displayStyle[tmpid]['state'] == false) {
              vm.displayStyle[tmpid]['state'] = true;
            }
            else {
              vm.displayStyle[tmpid]['state'] = false;
            }
          }
          else {
            vm.allSections.push(tmpid);
            var tmp;
            tmp = [];
            tmp['width'] = "16.666666667%";
            var t = ((cur.start_time - 480) / 60 + 1) / 15 * 100;
            tmp['top'] = t.toString() + "%";
            switch (cur.day) {
              case "M":
                  t = 1;
                  break;
              case "T":
                  t = 2;
                  break;
              case "W":
                  t = 3;
                  break;
              case "R":
                  t = 4;
                  break;
              case "F":
                  t = 5;
                  break;
              default:
                  break;
            }
            t = t / 6 * 100;
            tmp['left'] = t.toString() + "%";
            t = (cur.end_time - cur.start_time) / 60 / 15 * 100;
            tmp['height'] = t.toString() + "%";
            tmp['color'] = color;
            tmp['state'] = true;
            tmp['courseid'] = sharedProperties.getFocusedCourse().classTag + "-" + sec.ident;
            tmp['display'] = sharedProperties.getFocusedCourse().classTag + "-" + sec.ident + "<br>CRN: " + sec.call_number + "<br>" + sec.instructor.fname + " " + sec.instructor.lname
                                                                          + "<br>Seats: " + sec.seats.actual + "/" + sec.seats.capacity;
            console.log(sharedProperties.getFocusedCourse());
            vm.displayStyle[tmpid] = tmp;
          }
        }
        if (v == false) {
          for (var i = 0; i < rls.length; i++) {
            var tid = rls[i];
            vm.relateSec[tid] = [];
            for (var j = 0; j < rls.length; j++) {
              vm.relateSec[tid].push(rls[j]);
            }
          }
        }
    }

    vm.currentSchedule = [];

    vm.calculate = function() {
      for (var s = 0; s < vm.currentSchedule.length; s++) {
        var sect = vm.currentSchedule[s];
        vm.displayStyle[sect]['state'] = false;
      }
      vm.currentSchedule = [];
      for (var ind = 0; ind < this.morningTimeCons.length; ind++) {
            sharedProperties.setTimeConstraintByDay(ind, this.morningTimeCons[ind] * 60, this.afternoonTimeCons[ind] * 60);
      }
      sharedProperties.addSchedules(autoScheduler.getSchedules());
      scheduleService.uploadSchedules();
      var allSchedules = sharedProperties.getSchedules();
      if (allSchedules.length == 0) {
        return;
      }
      for (var k = 0; k < allSchedules[0].courses.length; k++) {
        var sec = allSchedules[0].courses[k].section;
        var id = allSchedules[0].courses[k].ref;
        var shortid = sec.ref_num.toString();
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var j = 0; j < 6; j++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        var rls = [];
        var v = false;
        for (var i in sec.timeSlots) {
          var cur = sec.timeSlots[i];
          var tmpid = shortid + sec.timeSlots[i].day + cur.start_time.toString();
          vm.currentSchedule.push(tmpid);
          rls.push(tmpid);
          if (vm.allSections.indexOf(tmpid) != -1) {
            v = true;
            if (vm.displayStyle[tmpid]['state'] == false) {
              vm.displayStyle[tmpid]['state'] = true;
            }
            else {
              vm.displayStyle[tmpid]['state'] = false;
            }
          }
          else {
            vm.allSections.push(tmpid);
            var tmp;
            tmp = [];
            tmp['width'] = "16.666666667%";
            var t = ((cur.start_time - 480) / 60 + 1) / 15 * 100;
            tmp['top'] = t.toString() + "%";
            switch (cur.day) {
              case "M":
                  t = 1;
                  break;
              case "T":
                  t = 2;
                  break;
              case "W":
                  t = 3;
                  break;
              case "R":
                  t = 4;
                  break;
              case "F":
                  t = 5;
                  break;
              default:
                  break;
            }
            t = t / 6 * 100;
            tmp['left'] = t.toString() + "%";
            t = (cur.end_time - cur.start_time) / 60 / 15 * 100;
            tmp['height'] = t.toString() + "%";
            tmp['color'] = color;
            tmp['state'] = true;
            tmp['courseid'] = id;
            vm.displayStyle[tmpid] = tmp;
          }
        }
        if (v == false) {
          for (var i = 0; i < rls.length; i++) {
            var tid = rls[i];
            vm.relateSec[tid] = [];
            for (var j = 0; j < rls.length; j++) {
              vm.relateSec[tid].push(rls[j]);
            }
          }
        }
      }
    }

    vm.changeSchedule = function(sche) {
      for (var s = 0; s < vm.currentSchedule.length; s++) {
        var sect = vm.currentSchedule[s];
        vm.displayStyle[sect]['state'] = false;
      }
      vm.currentSchedule = [];
      for (var k = 0; k < sche.courses.length; k++) {
        var sec = sche.courses[k].section;
        var id = sche.courses[k].ref;
        var shortid = sec.ref_num.toString();
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';

        for (var j = 0; j < 6; j++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        var rls = [];
        var v = false;
        for (var i in sec.timeSlots) {
          var cur = sec.timeSlots[i];
          var tmpid = shortid + sec.timeSlots[i].day + cur.start_time.toString();
          vm.currentSchedule.push(tmpid);
          rls.push(tmpid);
          if (vm.allSections.indexOf(tmpid) != -1) {
            v = true;
            if (vm.displayStyle[tmpid]['state'] == false) {
              vm.displayStyle[tmpid]['state'] = true;
            }
            else {
              vm.displayStyle[tmpid]['state'] = false;
            }
          }
          else {
            vm.allSections.push(tmpid);
            var tmp;
            tmp = [];
            tmp['width'] = "16.666666667%";
            var t = ((cur.start_time - 480) / 60 + 1) / 15 * 100;
            tmp['top'] = t.toString() + "%";
            switch (cur.day) {
              case "M":
                  t = 1;
                  break;
              case "T":
                  t = 2;
                  break;
              case "W":
                  t = 3;
                  break;
              case "R":
                  t = 4;
                  break;
              case "F":
                  t = 5;
                  break;
              default:
                  break;
            }
            t = t / 6 * 100;
            tmp['left'] = t.toString() + "%";
            t = (cur.end_time - cur.start_time) / 60 / 15 * 100;
            tmp['height'] = t.toString() + "%";
            tmp['color'] = color;
            tmp['state'] = true;
            tmp['courseid'] = id;
            vm.displayStyle[tmpid] = tmp;
          }
        }
        if (v == false) {
          for (var i = 0; i < rls.length; i++) {
            var tid = rls[i];
            vm.relateSec[tid] = [];
            for (var j = 0; j < rls.length; j++) {
              vm.relateSec[tid].push(rls[j]);
            }
          }
        }
      }
    }


    $scope.updateConstraints = function(start, end) {
        $scope.constraint.s = start;
        $scope.constraint.e = end;
        var tmp;

        for (var i in sharedProperties.getTimeConstraint()) {
            if ($scope.constraint.day === sharedProperties.getTimeConstraint()[i].day) {
                var tmp = sharedProperties.getTimeConstraint();
                tmp[i].start_time = $scope.constraint.s;
                tmp[i].end_time = $scope.constraint.e;
                sharedProperties.setTimeConstraint(tmp);
            }
        }
    }

    vm.showItem = function(item) {
      $scope.constraint.day = item.day;
      $scope.constraint.s = item.start_time;
      $scope.constraint.e = item.end_time;
    }

    this.calculateSchedule = function() {
        for (var ind = 0; ind < this.morningTimeCons.length; ind++) {
            sharedProperties.setTimeConstraintByDay(ind, this.morningTimeCons[ind] * 60, this.afternoonTimeCons[ind] * 60);
        }
        sharedProperties.addSchedules(autoScheduler.getSchedules());
        scheduleService.uploadSchedules();
    }

    this.sliderOptions = {
        floor: 8,
        ceil: 21,
        draggableRange: true,
        rightToLeft: true,
        vertical: true,
        showTicks: true,
        hidePointerLabels: true,
        hideLimitLabels: true
    }
    this.sliderEndOptions = {
        floor: 8,
        ceil: 21,
        draggableRange: true,
        rightToLeft: true,
        vertical: true,
        showTicksValues: true,
        hidePointerLabels: false
    }
    this.morningTimeCons = [8, 8, 8, 8, 8];
    this.afternoonTimeCons = [21, 21, 21, 21, 21];
}]);

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});