var app = angular.module('app');
app.factory('requestCourseOff', ['$http', function($http) {
    var urlParser = function(config) {
        var url = "https://soc.courseoff.com/";
        if (config.length >= 1) {
            url += (config[0] + '/terms/');
        }
        if (config.length >= 2) {
            url += (config[1] + '/majors/');
        }
        if (config.length >= 3) {
            url += (config[2] + '/courses/');
        }
        if (config.length >= 4) {
            url += (config[3] + '/sections/');
        }
        return url;
    };
    return function(config, callBack) {
        $http.get(urlParser(config)).success(function(data) {
            callBack(data);
        });
    };
}]);