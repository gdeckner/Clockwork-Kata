var timeStore = "";
var isNewTime = 0;

function GetLocalTime() {

    var xhttp = new XMLHttpRequest();
    var selectTimeZoneList = document.getElementById("timeZoneSelect");
    var timeZoneSelected = selectTimeZoneList[selectTimeZoneList.selectedIndex].value;

    isNewTime = 1;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var pulledTime = JSON.parse(this.responseText);
            timeStore = pulledTime.time;


            InsertDataToTable(
                pulledTime.currentTimeQueryId,
                pulledTime.clientIp,
                pulledTime.utcTime,
                pulledTime.time,
                pulledTime.timeZone)
        }

    };
    if (timeZoneSelected.includes("+")) {
        timeZoneSelected = timeZoneSelected.replace("+", "%2B");
    }
    xhttp.open("GET", "http://localhost:57074/api/currenttime/?timeZoneId=" + timeZoneSelected, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

}
//Takes the time and formats it into a prettier format.
function FormatTime(pulledTime) {
    var result = "";
    var time = new Date(pulledTime);
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    var period = "AM";
    if (hours == 0) {
        hours = 12
    }
    else if (hours > 12) {
        hours = hours - 12;
        period = "PM";
    }
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    var result = hours + ":" + minutes + ":" + seconds + " " + period;

    return result;
}
//Is called in the Startup Function, and continuously increments the time by 1 second every 1 second. It also checks if the client just queried for a new time and updates the loop with the new time.
function UpdateClock() {
    if (!timeStore == "") {
        var newTime = new Date(timeStore);
        newTime.setSeconds(newTime.getSeconds() + 1);
        var formatttedTime = FormatTime(newTime);

        if (isNewTime === 0) {
            timeStore = newTime;
        }
        document.getElementById("output").innerHTML = formatttedTime;


        isNewTime = 0;
    }

    setTimeout(UpdateClock, 1000);

}
//Pulls all the times from the database then calls the InsertDataToTable Function to populate the tables.
function GetAllTimes() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var timeListResponses = JSON.parse(this.responseText);
            for (i = 0; i < timeListResponses.length; i++) {
                InsertDataToTable(
                    timeListResponses[i].currentTimeQueryId,
                    timeListResponses[i].clientIp,
                    timeListResponses[i].utcTime,
                    timeListResponses[i].time,
                    timeListResponses[i].timeZone)
            }

        }


    };
    xhttp.open("GET", "http://localhost:57074/api/currenttime/pullTimes/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();


}
//Inserts the pulled data from the server into the data rows, it also calls upon the FormatTime function to help display the time better.
function InsertDataToTable(currentTimeQuery, clientIp, utcTime, time, timeZone) {


    var utcDate = "";
    if (isNewTime == 1) {
        utcDate = new Date(utcTime.substring(0, utcTime.length - 1));
    }
    else {
        utcDate = new Date(utcTime);
    }
    var timeDate = new Date(time);
    var table = document.getElementById("dbTable");
    var row = table.insertRow(1);
    row.setAttribute("class", "dataRows");


    var formattedUtcTime = (utcDate.getUTCMonth() + 1) + '/' + utcDate.getUTCDate() + '/' + utcDate.getUTCFullYear() + "&nbsp &nbsp &nbsp &nbsp &nbsp" + FormatTime(utcDate);
    var formattedTime = (timeDate.getMonth() + 1) + '/' + timeDate.getDate() + '/' + timeDate.getFullYear() + "&nbsp &nbsp &nbsp &nbsp &nbsp" + FormatTime(timeDate);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = currentTimeQuery;
    cell2.innerHTML = formattedTime;
    cell3.innerHTML = timeZone;;
    cell4.innerHTML = clientIp;
    cell5.innerHTML = formattedUtcTime;

}
// Gets all the Timezones from the server/api then populates the drop down
function TimeZoneList() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var x = document.getElementById("timeZoneSelect")
            var timeZoneList = JSON.parse(this.responseText)

            for (i = 0; timeZoneList.length > i; i++) {

                var option = document.createElement("option");
                option.setAttribute("value", timeZoneList[i].Id);

                option.text = timeZoneList[i].DisplayName;
                x.appendChild(option);


            }
        }

    };
    xhttp.open("GET", "http://localhost:57074/api/currenttime/timeZoneList", false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
//Upon loading the page it sets the drop down time zone list to the clients current time zone.
function SetLocalTimeZone() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var x = document.getElementById("timeZoneSelect")
            var localTimeZone = this.responseText;

            for (i = 0; i < x.length; i++) {
                if (x[i].value == localTimeZone) {
                    x[i].setAttribute("selected", true);
                }
            }

        }
    }
    xhttp.open("GET", "http://localhost:57074/api/currenttime/setLocalTimeZone", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function StartUp() {
    TimeZoneList();
    SetLocalTimeZone();
    GetAllTimes();
    UpdateClock();
}


