function submitData() {
    var inputValues = [];
    $("form :input").each(function() {
        inputValues.push(this);
    })
    //Empty Name
    if (inputValues[0].value == "") {
        createWarning("nameerror", inputValues[0], "Please give a name");
    } else {
        removeWarning("nameerror");
    }

    //Empty Phone Number
    if (inputValues[1].value == "") {
        createWarning("phoneerror", inputValues[1], "Please give a phone number");
    } else {
        removeWarning("phoneerror");
    }

    //Empty Street Number
    if (inputValues[3].value == "") {
        createWarning("streetnumerror", inputValues[3], "Please give a street number");
    } else {
        removeWarning("streetnumerror");
    }

    //Empty Street Name
    if (inputValues[4].value == "") {
        createWarning("streeterror", inputValues[4], "Please give a street");
    } else {
        removeWarning("streeterror");
    }

    //Suburb empty
    if (inputValues[5].value == "") {
        createWarning("suburberror", inputValues[5], "Please give a suburb");
    } else {
        removeWarning("suburberror");
    }

    //Pickup Time Empty
    if (inputValues[6].value == "") {
        createWarning("timeerror", inputValues[6].parentNode, "Please give a pickup time");
    } else {
        removeWarning("timeerror");

        //Logic for when user tries to book taxi today but hours or minutes in the past. Throw an error

        var d = new Date();
        var timeArr = inputValues[6].value.split(" ");
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        // if day entered is today in this month of this year
        if (parseInt(timeArr[0]) == d.getDate() && timeArr[1]==monthNames[d.getMonth()] && parseInt(timeArr[2]) == d.getFullYear()) {
            var hour = parseInt(timeArr[4].split(":")[0]);
            var min = parseInt(timeArr[4].split(":")[1]);
            //if pm add 12 hours
            if (timeArr[5] == 'pm') {
                hour = hour + 12;
            } else {

            }
            // if input hours in the past throw error
            if (hour < d.getHours()) {
                createWarning("timeerror", inputValues[6].parentNode, "Sorry our taxi drivers cannot go back in time.");
                //if in the current hour check minutes
            } else if (hour == d.getHours()) {
                //if minutes in the past throw error
                if (min < d.getMinutes()) {
                    createWarning("timeerror", inputValues[6].parentNode, "Sorry our taxi drivers cannot go back in time.");
                }
            }
        }
    }
    if (document.getElementById("nameerror") == null && document.getElementById("phoneerror") == null && document.getElementById("streetnumerror") == null && document.getElementById("streeterror") == null && document.getElementById("suburberror") == null && document.getElementById("timeerror") == null) {
        var xhr = createRequest();
        var url = "methods.php?name=" + inputValues[0].value + "&phone=" + inputValues[1].value + "&unit=" + (inputValues[2].value ? inputValues[2].value : "NULL") + "&streetnum=" + inputValues[3].value + "&street=" + inputValues[4].value + "&suburb=" + inputValues[5].value + "&time=" + inputValues[6].value;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert("Your Booking Has Been Submitted.");
                console.log(xhr.responseText);
            }
        }
        xhr.send(null);
    } else {
        alert("Incomplete Form");
    }
}


function createWarning(id, object, message) {
    if (document.getElementById(id) == null) {
        var error = document.createElement("span");
        error.setAttribute("id", id);
        error.setAttribute("style", "color: red;width:100%;display:block; text-align: center;");
        error.innerHTML = message;
        object.parentNode.children[0].appendChild(error);
    }
}

function removeWarning(id) {
    if (document.getElementById(id) != null) {
        var error = document.getElementById(id);
        error.parentNode.removeChild(error);
    }

}
