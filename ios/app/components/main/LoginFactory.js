angular.module("services").factory('LoginFactory', function ($http, WebService, CONSTANTS, $localstorage, Parser) {
    function getStudentData(callback) {
        var gradeBookURL = WebService.getLink(CONSTANTS.LINK_GRADEBOOK);

        $http({
            method: 'GET',
            url: gradeBookURL
        }).then(function (response) {
            console.log('Connection to grade book successful');
            var student = Parser.getStudentDetails(response.data);
            $localstorage.set(CONSTANTS.STUDENT_ID, student.id);
            $localstorage.set(CONSTANTS.STUDENT_NAME, student.name);
            $localstorage.set(CONSTANTS.STUDENT_COURSE, student.course);
            $localstorage.set(CONSTANTS.STUDENT_YEAR, student.year);
            console.log("Getting main links...");
            getMainLinks(callback);
        }, function (response) {
            console.log("Failure to connect to grade book: " + response);
            callback.error();
        });
    }

    function getMainLinks(callback) {
        var mainLinkURL = WebService.getLink(CONSTANTS.LINK_MAIN_LINKS);
        $http({
            method: 'GET',
            url: mainLinkURL
        }).then(function (response) {
            console.log('Getting main links successful');
            $localstorage.set(CONSTANTS.DASHBOARD_URL, Parser.getDashboardURL(response.data));
            callback.success();
        }, function (response) {
            console.log("Failure to get main links: " + response);
            callback.error();
        }).then(function () {
            callback.complete();
        });
    }

    function login(username, password, callback) {
        console.log('Requesting login...');
        var url = WebService.getLink(CONSTANTS.LINK_LOGIN);
        var params = {
            user_id: username,
            password: password,
            x: "46",
            y: "4",
            body_color: "#9FBFD0",
            welcome_url: "../PARENTS_STUDENTS/main_files/login_success.htm",
            login_type: "parent_student"
        };

        $http({
            method: 'POST',
            url: url,
            data: params
        }).then(function (response) {
            console.log("Successfully got response from login request");
            var result = Parser.getLoginResult(response.data);
            if (result == CONSTANTS.USER_NOT_EXIST) {
                console.log("Username does not exists");
                callback.usernameNotExists();
            } else if (result == CONSTANTS.WRONG_PASSWORD) {
                console.log("Wrong password");
                var retriesLeft = response.data.charAt(response.data.indexOf(":") + 1);
                callback.wrongPassword(retriesLeft);
            } else if (result == CONSTANTS.LOGIN_EXCEEDED) {
                console.log("Login exceeded");
                callback.loginExceeded();
            } else {
                $localstorage.set(CONSTANTS.USERNAME, username);
                $localstorage.set(CONSTANTS.PASSWORD, password);
                console.log("Getting student data...");
                getStudentData(callback);
            }
        }, function (error) {
            console.log("Failure in signing in: " + error);
            callback.error();
        });
    }

    return {
        login: function (username, password, callback) {
            return login(username, password, callback);
        }
    }

});
