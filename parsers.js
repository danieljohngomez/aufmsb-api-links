//These are parser/scraping functions and objects tied to SchoolBliz
//Notes: DO NOT edit function names, for they are statically tied to the apps.
//       Increment API Version from version.html when changes are made.
//       Only edit when necessary.

//by Daniel John Gomez, djgomez23@gmail.com

var links = [
    {
        "name": "login",
        "url": "http://sblive.auf.edu.ph:8080/schoolbliz/commfile/login.jsp"
    },
    {
        "name": "change_password",
        "url": "http://sblive.auf.edu.ph:8080/schoolbliz/my_home/change_password.jsp"
    },
    {
        "name": "main_links",
        "url": "http://sblive.auf.edu.ph:8080/schoolbliz/PARENTS_STUDENTS/main_files/parents_students_main_links.jsp"
    },
    {
        "name": "gradebook",
        "url": "http://sblive.auf.edu.ph:8080/schoolbliz/PARENTS_STUDENTS/acad_performance/grade_release.jsp"
    },
    {
        "name": "forgot_password",
        "url": "http://sbpass.auf.edu.ph/test.php"
    },
    {
        "name": "accounts",
        "url": "http://sblive.auf.edu.ph:8080/schoolbliz/PARENTS_STUDENTS/accounts/student_ledger.jsp"
    },
    {
        "name": "notify",
        "url": "http://sbdashboard.auf.edu.ph/notify.php"
    }
];

function getLinks(){
    return JSON.stringify(links);
}


//data coming from login url
function getLoginResult(responseBody) {
    if (responseBody.indexOf("not exist") > -1) {
        return -1;
    } else if (responseBody.indexOf("Retries") > -1) {
        return -2;
    } else if (responseBody.indexOf("exceeded.") > -1) {
        return -3;
    } else {
        return 1;
    }
}

//data coming from main links url
function getDashboardURL(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var table = doc.getElementsByTagName("table")[0];
    var tr = table.getElementsByTagName("tr")[2];
    var td = tr.getElementsByTagName("td")[1];
    var a = td.getElementsByTagName("a")[0];
    return a.getAttribute("href");
}

//data coming from gradebook URL
function getStudentDetails(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var table = doc.getElementsByTagName("table")[1];
    var trs = table.getElementsByTagName("tr");
    var student = {};
    for (var i = 0; i <= 3; i++) {
        var tr = trs[i];
        var td = tr.getElementsByTagName("td")[1];
        var value = td.getElementsByTagName("strong")[0].innerText;
        switch (i) {
            case 0:
                student.id = value;
                break;
            case 1:
                student.name = value;
                break;
            case 2:
                student.course = value;
                break;
            case 3:
                student.year = value;
                break;
        }
    }
    return student;
}

//data coming from dashboard URL
function getEmail(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var text = doc.querySelector('div.notification').innerText;
    var splits = text.split(" ");
    return splits[splits.length - 1].trim();
}

//data coming from dashboard URL
function getEmailNotificationStatus(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var input = doc.querySelector('input#myonoffswitch');
    return contains(input.outerHTML, "checked");
}

//data coming from dashboard URL
function getRequirements(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var text = doc.querySelector('div.clearance');
    var titles = text.getElementsByTagName("h3");
    var hrs = text.getElementsByTagName("hr");
    if (titles.length > 0) {
        titles[0].parentNode.removeChild(titles[0]);
    }
    if (hrs.length > 0) {
        hrs[0].parentNode.removeChild(hrs[0]);
    }
    return text.innerHTML;
}

//data coming from dashboard URL
function getInterventions(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var text = doc.querySelector('div.schedule');
    var titles = text.getElementsByTagName("h3");
    var hrs = text.getElementsByTagName("hr");
    if (titles.length > 0) {
        titles[0].parentNode.removeChild(titles[0]);
    }
    if (hrs.length > 0) {
        hrs[0].parentNode.removeChild(hrs[0]);
    }
    return text.innerHTML;
}

//data coming from dashboard URL
function getScheduleDays(responseBody) {
    var doc = getDocumentFromResponseBody(responseBody);
    var days = [];
    try {
        var daysElement = doc.getElementsByClassName("tabs")[0].getElementsByTagName("li");
        if (daysElement.length <= 0) {
            return null;
        }

        for (var i = 0; i < daysElement.length; i++) {
            days.push(daysElement[i].innerText);
        }
    } catch (error) {
        return null;
    }
    return days;
}

//data coming from dashboard URL
function getScheduleSubjects(responseBody) {
    var subjects = [];
    var doc = getDocumentFromResponseBody(responseBody);

    var tables = doc.querySelector("div.tabcontents").getElementsByTagName("table");
    for (var i = 0; i < tables.length; i++) {
        var trs = tables[i].getElementsByTagName("tr");
        var subj = [];
        for (var j = 1; j < trs.length; j++) {
            var tds = trs[j].getElementsByTagName("td");
            for (var k = 0; k < tds.length; k++) {
                subj.push(tds[k].innerText);
            }
        }
        subjects.push(subj);
    }
    return subjects;
}

//data coming from dashboard URL
function generateScheduleList(days, subjects) {
    var schedules = [];
    var k = 0;
    for (var i = 0; i < days.length; i++) {
        var schedule = {
            day: days[i]
        };
        //var subs = [subjects[i].length / 3];
        var subs = [];
        for (var j = 0; j < subjects[i].length; j += 3) {
            var day = subjects[i];
            var sub = {
                title: day[j],
                time: day[j + 1],
                room: day[j + 2]
            };
            subs[k++] = sub;
        }
        schedule.subjects = subs;
        schedules.push(schedule);
        k = 0;
    }
    return schedules;
}

function getDataFromGradeDocument(responseBody, elementIndex) {
    var items = [];
    try {
        var gradeTableIndex = 4;
        var doc = getDocumentFromResponseBody(responseBody);
        var table = doc.getElementsByTagName("table")[gradeTableIndex];
        var trs = table.getElementsByTagName("tr");
        for (var i = 1; i < trs.length; i++) {
            var element = trs[i].getElementsByTagName("td")[elementIndex];
            var result = element.innerText.replace("\\u00A0", "").trim();
            items.push(result);
        }
        return items;
    } catch (error) {
        if (elementIndex == 0) {
            throw new Error("No data found");
        } else {
            items.push("");
            return items;
        }
    }

}

//Ensures that all list have same number of elements
function adjustSizes() {
    var highestIndex = 0;
    for (var argument in arguments) {
        var listSize = argument.length;
        if (listSize > highestIndex) {
            highestIndex = listSize;
        }
    }

    for (var argument in arguments) {
        while (argument.length < highestIndex) {
            argument.add("");
        }
    }
}

//data coming from gradebook URL
function getGrades(responseBody) {
    //Element indices based from the document
    var subjectCodeIndex = 0;
    var subjectNameIndex = 1;
    var creditIndex = 2;
    var instructorIndex = 3;
    var gradeIndex = 4;
    var remarksIndex = 5;

    var gradeList = [];
    try {
        var subjectCodes = getDataFromGradeDocument(responseBody, subjectCodeIndex);
        var subjectNames = getDataFromGradeDocument(responseBody, subjectNameIndex);
        var credits = getDataFromGradeDocument(responseBody, creditIndex);
        var instructors = getDataFromGradeDocument(responseBody, instructorIndex);
        var grades = getDataFromGradeDocument(responseBody, gradeIndex);
        var remarks = getDataFromGradeDocument(responseBody, remarksIndex);
        adjustSizes(subjectCodes, subjectNames, credits, instructors, grades, remarks);

        for (var i = 0; i < subjectCodes.length; i++) {
            var grade = {
                code: subjectCodes[i],
                name: subjectNames[i],
                credit: credits[i],
                instructor: instructors[i],
                grade: contains(grades[i], "not encoded") ? "NA" : grades[i],
                remark: remarks[i]
            };
            gradeList.push(grade);
        }

        return gradeList;
    } catch (error) {
        return gradeList;
    }
}


//data coming from accounts URL
function getAccounts(responseBody) {
    var accounts = [];
    try {
        var doc = getDocumentFromResponseBody(responseBody);
        var table = doc.getElementsByTagName("table")[4];
        var trs = table.getElementsByTagName("tr");
        var balance = trs[1].getElementsByTagName("td")[2].innerText;
        var oldAccount = {
            balance: balance,
            name: "Old Accounts"
        };
        accounts.push(oldAccount);
        for (var i = 2; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName("td");
            var account = {
                date: tds[0].innerText,
                name: tds[1].innerText,
                collectedByID: tds[2].innerText,
                debit: tds[3].innerText,
                credit: tds[4].innerText,
                balance: tds[5].innerText
            };
            accounts.push(account);
        }
        return accounts;
    } catch (error) {
        return accounts;
    }
}

//Utility functions
function contains(toProcess, valueToCheck){
    return toProcess.indexOf(valueToCheck) > -1;
}

function getDocumentFromResponseBody(responseBody){
    var doc = document.createElement('html');
    return doc.innerHTML = responseBody.replace(/<img[^>]*>/g, "");
}