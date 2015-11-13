var dashboard = angular.module("controllers");

dashboard.controller('DashboardCtrl', function ($scope, DashboardFactory) {

    $scope.loading = true;
    $scope.indicator = 'Preparing dashboard';
    $scope.noSchedule = false;

    $scope.selectDay = function (index) {
        for (var i = 0; i < $scope.schedule.length; i++) {
            if (i == index) {
                $scope.schedule[i].selected = true;
                $scope.selectedDay = $scope.schedule[i];
            } else {
                $scope.schedule[i].selected = false;
            }
        }
    };

    var callback = {
        success: function (schedule, requirements, interventions) {
            $scope.loading = false;
            $scope.requirements = requirements;
            $scope.interventions = interventions;
            $scope.schedule = schedule;
            $scope.selectDay(0);
        }, error: function () {
            $scope.loading = false;
        }, noSchedule: function (requirements, interventions) {
            $scope.noSchedule = true;
            $scope.loading = false;
            $scope.requirements = requirements;
            $scope.interventions = interventions;
        }, errorWithCached: function () {
            $scope.loading = false;
        }
    };
    DashboardFactory.getDashboardContents(callback);

});

dashboard.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value;
    };
});
