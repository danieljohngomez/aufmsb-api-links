angular.module('controllers').controller('GradebookCtrl', function ($scope, WebService, GradebookFactory, $ionicModal, Utils, $localstorage, CONSTANTS) {
    $scope.isLoading = true;
    $scope.hasMessage = false;
    $scope.term = $localstorage.get(CONSTANTS.GRADEBOOK_TERM, 'Prelim');
    $scope.semester = $localstorage.get(CONSTANTS.GRADEBOOK_SEMESTER, '1st Semester');
    var defaultYear = Utils.getDefaultYear();
    $scope.syFrom = $localstorage.get(CONSTANTS.GRADEBOOK_SY_FROM, defaultYear);
    $scope.syTo = parseInt($scope.syFrom) + 1;

    function computeGWA(grades) {
        var sum = 0;
        var totalNumberOfUnits = 0;
        if (grades.length == 0) {
            return "NA";
        }
        for (var i = 0; i < grades.length; i++) {
            var g = grades[i];
            if (Utils.contains(g.code,"NSTP")) {
                continue;
            }
            var grade = parseFloat(g.grade);
            var units = parseFloat(g.credit);
            if (isNaN(grade) || isNaN(units)) {
                continue;
            }
            sum += (units * grade);
            totalNumberOfUnits += units;
        }
        if(totalNumberOfUnits == 0){
            return "NA";
        }
        return (sum / totalNumberOfUnits).toFixed(1);
    }

    var requestGradeCallback = {
        success: function (grades) {
            $scope.gwa = computeGWA(grades);
            if (grades.length > 0) {
                $scope.grades = grades;
                $scope.isLoading = false;
                $scope.hasMessage = false;
            } else {
                $scope.hasMessage = true;
                $scope.message = "No data found";
                $scope.isLoading = false;
            }
            $scope.$broadcast('scroll.refreshComplete');
        }, error: function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.hasMessage = true;
            $scope.message = "Can't connect to the server";
            $scope.isLoading = false;
        }
    };
    var updateAPICallback = {
        success: function () {
            GradebookFactory.requestGrades(requestGradeCallback);
        },
        error: function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.hasMessage = true;
            $scope.message = "Can't connect to the server";
            $scope.isLoading = false;
        }
    };


    $ionicModal.fromTemplateUrl('app/components/gradebook/popover-gradeQuery.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.gradeQueryModal = modal;
    });
    $scope.openGradeQueryModal = function () {
        $scope.gradeQueryModal.show();
    };
    $scope.closeGradeQueryModal = function () {
        $scope.gradeQueryModal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.gradeQueryModal.remove();
    });

    $scope.requestGrades = function (term, semester, syFrom){
        $scope.isLoading = true;
        $scope.hasMessage = false;
        $scope.gwa = "";
        if(term){
            $localstorage.set(CONSTANTS.GRADEBOOK_TERM, term);
            $localstorage.set(CONSTANTS.GRADEBOOK_SEMESTER, semester);
            $localstorage.set(CONSTANTS.GRADEBOOK_SY_FROM, syFrom);
            $scope.term = term;
            $scope.semester = semester;
            $scope.syFrom = syFrom;
            $scope.syTo = parseInt($scope.syFrom) + 1;
        }
        if($scope.gradeQueryModal){
            $scope.closeGradeQueryModal();
        }
        WebService.updateAPI(updateAPICallback);
    };

    $scope.requestGrades();
});
