var module = angular.module("sampleApp", ['ngRoute']);
module.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
})
module.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/route1', {
                //templateUrl: '/templates/myapp/test1.html',
                templateUrl: static_url + '/myapp/html/test1.html',
                controller: 'RouteController1'
            }).
            when('/route2', {
                //templateUrl:'/templates/myapp/test2.html',
                templateUrl: static_url + '/myapp/html/test2.html',
                controller: 'RouteController2'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

module.controller("RouteController1", function($scope) {
    $scope.test="This is working test1"
});
module.controller("RouteController2", function($scope) {
    $scope.test="This is working test2"
});
