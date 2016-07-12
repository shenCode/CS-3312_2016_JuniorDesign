var app = angular.module('app');
app.service('dbservice', ['User', 'Schedule', function(User, Schedule){
	var user = new User();
    //Return 401 for Unauthorized login attempt
    //or json object for success login
	this.getUserWithEmail = function(req) {
        user.email = req.email;
        user.password = req.password;
        //user.email = "test1_us@gmail.com";
        //user.password = "test1_usr";
		return user.$getUserWithName();
	};
    this.getAllUsers = function() {
        user.$getAllUsers();
    };
    // return 200 for success registration
    // or 401 for existed user
    this.createUser = function(req) {
        user.email = req.email;
        user.username = req.username;
        user.password = req.password;
        console.log(req)
        return user.$createUser();
    };
    this.updateUser = function() {
        user.$updateUser();
    };

    var schedule = new Schedule();

    this.postSchedulesWithEmail = function(schedules, email) {
        //console.log(req);
        schedule.schedules = schedules;
        schedule.email = email;
        return schedule.$postSchedulesWithEmail();
        
    }

    this.getSchedulesWithEmail = function(email) {
        schedule.email = email;
        return schedule.$getSchedulesWithEmail();
    } 

    this.getVersionIDs = function(req) {
        schedule.email = req.email;
        schedule.forVersionID = req.forVersionID;
        return schedule.$getVersionIdForEmail();
    }

}]);