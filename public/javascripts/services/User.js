var app = angular.module('app');

app.factory("User", ["$resource", "sharedProperties", function($resource, sharedProperties) {
  return $resource("/user/:email", {
    email: '@email'}, {
    'getAllUsers': {method: 'GET', isArray: true},
    'getUserWithName': {
      method: 'POST', 
      interceptor: {
        response: function(res) {
          console.log("response in interceptor", res);
          sharedProperties.setLoginStatus(true);
        },
        responseError: function(err) {
          console.log("error in interceptor", err);
          sharedProperties.setLoginStatus(false);
        }
      }
    },
    'createUser' : {
      method: 'PUT',
      interceptor: {
        response: function(res) {
          sharedProperties.setLoginStatus(true);
          console.log(sharedProperties.getLoginStatus());
          console.log("returning true")
        },
        responseError: function(err) {
          sharedProperties.setLoginStatus(false);
          console.log(sharedProperties.getLoginStatus());
        }
      }
    },
    'updateUser' : {method: 'POST'}
  });
}]);