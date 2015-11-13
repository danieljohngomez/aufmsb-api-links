angular.module('controllers').controller('GradeQueryCtrl', function ($scope) {
    $scope.terms = ["Prelim", "Midterm", "Final"];
    $scope.semesters = ["1st Semester", "2nd Semester", "3rd Semester", "Summer"];
    $scope.decrementYear = function (){
        $scope.syFrom = parseInt($scope.syFrom) - 1;
    };
    $scope.incrementYear = function (){
        $scope.syFrom = parseInt($scope.syFrom) + 1;
    };
});