app = angular.module("demoapp", []);

app.controller('DemoCtrl', ['$scope', function($scope) {
    $scope.num = 0;

    $scope.save = function() {
        $(".data").html("Click: " + $scope.num);
        $scope.num += 1;
    };
}]);
