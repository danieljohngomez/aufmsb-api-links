angular.module("services")
    .factory('AccountsFactory', function ($http, Parser, WebService, CONSTANTS, $localstorage, Utils) {

        function requestAccounts(callback) {
            console.log("Requesting accounts...");
            var semester = $localstorage.get(CONSTANTS.ACCOUNTS_SEMESTER, '1st Semester');
            var defaultYear = Utils.getDefaultYear();
            var syFrom = $localstorage.get(CONSTANTS.ACCOUNTS_SY_FROM, defaultYear);
            var syTo = parseInt(syFrom) + 1;
            var semNumber = Utils.semNameToNumber(semester);
            var idNumber = $localstorage.get(CONSTANTS.STUDENT_ID, "");

            var url = WebService.getLink(CONSTANTS.LINK_ACCOUNTS);
            var params = {
                stud_id: idNumber,
                sy_from: syFrom,
                sy_to: syTo,
                semester: semNumber,
                "image.x": "12",
                "image.y": "6",
                id_in_url: ""
            };

            $http({
                method: 'POST',
                url: url,
                data: params
            }).then(function (response) {
                console.log("Successfully connected to accounts");
                //TODO ENSURE VALID SESSION
                callback.success(Parser.getAccounts(response.data));
            }, function (error) {
                if (error.status == 500) {
                    console.log("Successfully connected to accounts");
                    var empty = [];
                    callback.success(empty);
                } else {
                    console.log("Failure to get accounts data: " + error);
                    callback.error();
                }
            });
        }

        return {
            requestAccounts: function (callback) {
                return requestAccounts(callback);
            }
        }
    });