
var app = angular.module('app',['ngResource', 'ngRoute', 'ngSanitize', 'ui.select', 'rzModule']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/Main', {
            templateUrl: '../views/mainPage.html',
            controller: "selectorController",
            controllerAs: "selectCtrl"
        })
        .when('/Login', {
            templateUrl: '../views/loginPage.html',
            controller: 'loginController',
            controllerAs: 'loginCtrl'
        })
        .when('/Signup', {
            templateUrl: '../views/signupPage.html',
            controller: "signUpController",
            controllerAs: "signUpCtrl"
        })
        .when('/prototype', {
            templateUrl: '../views/prototype.html',
            controller: "everything",
            controllerAs: "ctrl"
        }) 
        .otherwise({redirectTo: '/prototype'});
});

app.filter('dayFilter', function(){
    return function(input) {
        if (input == "M") {
            return "Monday";
        } else if (input == "T") {
            return "Tuesday";
        } else if (input == "W") {
            return "Wednesday";
        } else if (input == "R") {
            return "Thursday";
        } else if (input == "F") {
            return "Friday";
        }
        return "Undefined";
    }
})

app.filter('timeFilter', function() {
    return function(input) {
        return Math.floor(input / 60) + ":" + ((input % 60) < 10 ? ('0' + (input % 60)) : (input % 60));
    }
})

app.controller('selectorController', 
['$scope','sharedProperties', 'requestService', 'autoScheduler', 'scheduleService',
function($scope, sharedProperties, requestService, autoScheduler, scheduleService) {
    $scope.sharedProperties = sharedProperties;
    $scope.requestService = requestService;
    $scope.autoScheduler = autoScheduler;
    $scope.scheduleService = scheduleService;
    requestService.requestOnLoad();
    this.calculateSchedule = function() {
        for (var ind = 0; ind < this.morningTimeCons.length; ind++) {
            sharedProperties.setTimeConstraintByDay(ind, this.morningTimeCons[ind] * 60, this.afternoonTimeCons[ind] * 60);
        }
        sharedProperties.addSchedules(autoScheduler.getSchedules());
        scheduleService.uploadSchedules();
    }
    this.sliderOptions = {
        floor: 8,
        ceil: 18,
        draggableRange: true,
        rightToLeft: true,
        vertical: true,
        showTicks: true,
        hidePointerLabels: true,
        hideLimitLabels: true
    }
    this.sliderEndOptions = {
        floor: 8,
        ceil: 18,
        draggableRange: true,
        rightToLeft: true,
        vertical: true,
        showTicksValues: true,
        hidePointerLabels: false
    }
    this.morningTimeCons = [10, 10, 10, 10, 10];
    this.afternoonTimeCons = [16, 16, 16, 16, 16];
}]);

app.controller('dbController', ['$scope', 'dbservice', function($scope, dbservice){
    $scope.dbservice = dbservice;
}]);

app.controller('navBarController', ['$scope', 'dbservice', 'sharedProperties',
function($scope, dbservice, sharedProperties) {
    $scope.dbservice = dbservice;
    $scope.sharedProperties = sharedProperties;
}]);

app.controller('loginController', ['$scope', '$location', 'dbservice', 'sharedProperties', 
function($scope, $location, dbservice, sharedProperties) {
    $scope.dbservice = dbservice;
    $scope.sharedProperties = sharedProperties;
    this.errorMsg = "";
    var _this = this;
    this.attemptLogin = function() {
        dbservice.getUserWithEmail({"email": this.identity, "password": this.password}).then(function(){
            console.log(sharedProperties.getLoginStatus());
            console.log(_this.identity);
            if (sharedProperties.getLoginStatus()) {
                sharedProperties.setEmail(_this.identity);
                console.log(_this.identity);
                dbservice.getSchedulesWithEmail(_this.identity).then(function() {
                  console.log(sharedProperties.getSchedules());
                });
                $location.path('#/prototype');
                _this.identity = "";
                _this.password = "";
            } else {
                _this.errorMsg = "Wrong email password pair";
                $("#inputPassword").focus();
                _this.password = "";
                //TODO: change placeholder text color, use CSS
            }
        });
        

    }
}]);

app.controller('signUpController', ['$scope', '$location', 'dbservice', 'sharedProperties', 
function($scope, $location, dbservice, sharedProperties) {
    $scope.dbservice = dbservice;
    $scope.sharedProperties = sharedProperties;
    this.errorMsg = "";
    
    var _this = this;
    // console.log($scope.username);
    this.attemptSignUp = function() {
        if (this.password === this.passwordAgain) {
            dbservice.createUser({"email": this.identity, "password": this.password}).then(function() {
                if (sharedProperties.getLoginStatus()) {
                    sharedProperties.setEmail(_this.identity);
                    $location.path('#/prototype');
                    _this.identity = "";
                    _this.username = "";
                    _this.password = "";
                    _this.passwordAgain = "";
                } else {
                    _this.errorMsg = "Email already existed";
                    $("#inputEmail").focus();
                    //TODO: change placeholder text color, use CSS
                }
            });
        } else {
            _this.password = "";
            _this.passwordAgain = "";
            _this.errorMsg = "Passwords do not match";
            $("#inputPassword").focus();
            //TODO: change placeholder text color, use CSS
        }
    }
}]);