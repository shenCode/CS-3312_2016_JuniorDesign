var app = angular.module('app');

app.factory("Schedule", ["$resource", "sharedProperties", function($resource, sharedProperties) {
  return $resource("/schedules/:email/:forVersionID", {
    email: '@email', forVersionID: '@forVersionID'}, {
    'postSchedulesWithEmail': {
      method: 'POST', 
      interceptor: {
        response: function(res) {
          
        },
        responseError: function(err) {

        }
      }
    },
    'getSchedulesWithEmail': {
      method: 'GET',
      interceptor: {
        response: function(res) {
          console.log(res.data.schedules);
          sharedProperties.setSchedules(res.data.schedules);
        },
        responseError: function(err) {

        }
      }
    },
    'getVersionIdForEmail': {
      method: 'GET', 
      //isArray: true,
      interceptor: {
        response: function(res) {
          console.log("get Version Id interceptor, success: " + res.data.arr);
          sharedProperties.setVersionIDs(res.data.arr);
        },
        responseError: function(err) {
          console.log("get Version Id interceptor, error: " + err);
        }
      }
    },
  });
}]);