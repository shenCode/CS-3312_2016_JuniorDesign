var app = angular.module('app');
app.service('scheduleService', ['sharedProperties', 'dbservice',
function(sharedProperties, dbservice) {
    var _this = this;
    this.uploadSchedules = function() {
      if (sharedProperties.getLoginStatus()) {
        var schedules = sharedProperties.getSchedules();
        dbservice.getVersionIDs({"email": sharedProperties.getEmail(), "forVersionID" : "True"}).then(function(){
            console.log(sharedProperties.getEmail());
            data = sharedProperties.getVersionIDs();
            for (var ind = 0; ind < schedules.length; ind++) {
                schedules[ind].email = sharedProperties.getEmail();
                if ((!schedules[ind].versionId) || schedules[ind].versionId == "") {
                    if (ind >= data.length) {
                        schedules[ind].versionId = data[data.length - 1] + (ind - data.length + 1);
                    } else {
                        schedules[ind].versionId = data[ind];
                    }
                }
            }
            var schedulesJSON = [];
            for (var jnd = 0; jnd < schedules.length; jnd++) {
                console.log(schedules[jnd]);
                var scheduleJSON = angular.toJson(schedules[jnd]);
                // for (var i = 0; i < scheduleJSON.courses.length; i++) {
                //     console.log(scheduleJSON.coursesp[i].section["location"]);
                // }
                schedulesJSON[jnd] = scheduleJSON;
            }
            console.log(schedulesJSON);
            dbservice.postSchedulesWithEmail(schedulesJSON, sharedProperties.getEmail());
        });
      }
    }
}]);