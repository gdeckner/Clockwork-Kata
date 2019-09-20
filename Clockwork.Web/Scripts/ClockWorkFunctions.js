
function GetLocalTime() {

    var xhttp = new XMLHttpRequest();
    var selectTimeZoneList = document.getElementById("timeZoneSelect");
    var timeZoneSelected = selectTimeZoneList[selectTimeZoneList.selectedIndex].value;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let pulledTime = JSON.parse(this.responseText);
            document.getElementById("output").innerHTML = FormatTime(pulledTime.time);
            FormatTime(pulledTime);

            InsertDataToTable(
                pulledTime.currentTimeQueryId,
                pulledTime.clientIp,
                pulledTime.utcTime,
                pulledTime.time,
                pulledTime.timeZone)
        }
    };
    xhttp.open("GET", "http://localhost:57074/api/currenttime/?timeZoneId=" + timeZoneSelected, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

}
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
function InsertDataToTable(currentTimeQuery, clientIp, utctime, time, timeZone) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = currentTimeQuery;
    cell2.innerHTML = clientIp;
    cell3.innerHTML = utctime;
    cell4.innerHTML = time;
    cell5.innerHTML = timeZone;

}
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
}


