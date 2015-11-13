angular.module("services")
    .factory('DashboardFactory', function ($http, Parser, CONSTANTS, Utils, $localstorage) {

        function successCaching(callback) {
            var idNumber = $localstorage.get(CONSTANTS.STUDENT_ID, "");
            var schedule = $localstorage.getObject(idNumber + ".schedule");
            var requirements = $localstorage.get(idNumber + ".requirements", "");
            var interventions = $localstorage.get(idNumber + ".interventions", "");
            if (schedule) {
                callback.success(schedule, requirements, interventions);
            } else {
                console.log("no schedule");
                callback.noSchedule(requirements, interventions);
            }
        }

        function getDashboardContents(callback) {
            console.log("Getting dashboard contents...");
            var idNumber = $localstorage.get(CONSTANTS.STUDENT_ID, "");
            var schedule = $localstorage.getObject(idNumber + ".schedule");
            var requirements = $localstorage.get(idNumber + ".requirements", "");
            var interventions = $localstorage.get(idNumber + ".interventions", "");
            var hasCached = false;
            var url = $localstorage.get(CONSTANTS.DASHBOARD_URL, "");
            if (requirements != null && interventions != null) {
                hasCached = true;
                console.log("showing cached data");
                successCaching(callback);
            }

            $http({
                method: 'GET',
                url: url
            }).then(function (response) {
                var email = Parser.getEmail(response.data);
                var emailNotificationStatus = Parser.getEmailNotificationStatus(response.data);
                requirements = Parser.getRequirements(response.data);
                interventions = Parser.getInterventions(response.data);
                var days = Parser.getScheduleDays(response.data);
                if (days != null) {
                    var subjects = Parser.getScheduleSubjects(response.data);
                    schedule = Parser.generateScheduleList(days, subjects);
                } else {
                    schedule = null;
                }
                $localstorage.setObject(idNumber + ".schedule", schedule);
                $localstorage.set(idNumber + ".requirements", requirements);
                $localstorage.set(idNumber + ".interventions", interventions);
                $localstorage.set(CONSTANTS.STUDENT_EMAIL, email);
                $localstorage.set(CONSTANTS.EMAIL_NOTIFICATION_ENABLED, emailNotificationStatus);
                console.log("showing updated data");
                successCaching(callback);
            }, function (error) {
                console.log("Failure in connecting to dashboard");
                if (hasCached) {
                    console.log("But there is a cached data");
                    callback.errorWithCached();
                } else {
                    console.log(error);
                    callback.error();
                }
            });
        }

        return {
            getDashboardContents: function (callback) {
                return getDashboardContents(callback);
            }
        }
    });
