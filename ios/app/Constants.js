var app = angular.module("constants");

app.constant("CONSTANTS", (function() {
    var domain = "http://aufmschoolbliz.github.io";
    return {
        URL_API_LINKS: domain,
        URL_API_VERSION: domain + "/version",

        CLIENT_API_VERSION: "CLIENT_API_VERSION",
        LINKS_RAW_COLLECTION: "LINKS_RAW_COLLECTION",

        //LINKS
        //NOTE: MUST BE SAME AS THE NAME FROM WEBSERVICE
        LINK_LOGIN: 'login',
        LINK_CHANGE_PASSWORD: 'change_password',
        LINK_MAIN_LINKS: 'main_links',
        LINK_GRADEBOOK: 'gradebook',
        LINK_FORGOT_PASSWORD: 'forgot_password',
        LINK_ACCOUNTS: 'accounts',
        LINK_NOTIFY: 'notify',

        EMAIL_NOTIFICATION_ENABLED: 'EMAIL_NOTIFICATION_ENABLED',
        STUDENT_EMAIL: 'STUDENT_EMAIL',
        STUDENT_ID: 'STUDENT_ID',
        STUDENT_NAME: 'STUDENT_NAME',
        STUDENT_COURSE: 'STUDENT_COURSE',
        STUDENT_YEAR: 'STUDENT_YEAR',
        DASHBOARD_URL: 'DASHBOARD_URL',
        USERNAME: 'USERNAME',
        PASSWORD: 'PASSWORD',
        GRADEBOOK_TERM: 'GRADEBOOK_TERM',
        GRADEBOOK_SEMESTER: 'GRADEBOOK_SEMESTER',
        GRADEBOOK_SY_FROM: 'GRADEBOOK_SY_FROM',
        ACCOUNTS_SEMESTER: 'ACCOUNTS_SEMESTER',
        ACCOUNTS_SY_FROM: 'ACCOUNTS_SY_FROM',

        //LOGIN RESULTS
        USER_NOT_EXIST: -1,
        WRONG_PASSWORD: -2,
        LOGIN_EXCEEDED: -3,
        SUCCESS: 1



    }
})());