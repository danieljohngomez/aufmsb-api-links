angular.module('services')
    .factory('GradebookFactory', function ($http, Parser, Utils, CONSTANTS, $localstorage, WebService) {

        function requestGrades(callback) {
            var term = $localstorage.get(CONSTANTS.GRADEBOOK_TERM, 'Prelim');
            var semester = $localstorage.get(CONSTANTS.GRADEBOOK_SEMESTER, '1st Semester');
            var defaultYear = Utils.getDefaultYear();
            var syFrom = $localstorage.get(CONSTANTS.GRADEBOOK_SY_FROM, defaultYear);
            var syTo = parseInt(syFrom) + 1;
            var semNumber = Utils.semNameToNumber(semester);
            var url = WebService.getLink(CONSTANTS.LINK_GRADEBOOK);
            var params = {
                grade_name: term,
                semester_name: semester,
                grade_for: term,
                semester: semNumber,
                sy_from: syFrom,
                sy_to: syTo,
                x: "10",
                y: "9"
            };

            console.log("Requesting grades...");
            $http({
                method: 'POST',
                url: url,
                data: params
            }).then(function (response) {
                console.log("Request successful");
                //TODO ENSURE VALID SESSION
                callback.success(Parser.getGrades(response.data));
            }, function (error) {
                console.log("Failure in getting grades: " + error);
                callback.error();
            });
        }

        return {
            requestGrades: function (callback) {
                return requestGrades(callback);
            }
        }
    });
