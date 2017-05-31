//Function to handle the submitting of a new booking request.
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

    if (inputValues[6].value == "") {
        createWarning("suburbdesterror", inputValues[6], "Please give a destination suburb");
    } else {
        removeWarning("suburbdesterror");
    }
    //Pickup Time Empty
    if (inputValues[7].value == "") {
        createWarning("timeerror", inputValues[7].parentNode, "Please give a pickup time");
    } else {
        removeWarning("timeerror");

        //Logic for when user tries to book taxi today but hours or minutes in the past. Throw an error

        var d = new Date();
        var timeArr = inputValues[7].value.split(" ");
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
                createWarning("timeerror", inputValues[7].parentNode, "Sorry our taxi drivers cannot go back in time.");
                //if in the current hour check minutes
            } else if (hour == d.getHours()) {
                //if minutes in the past throw error
                if (min < d.getMinutes()) {
                    createWarning("timeerror", inputValues[7].parentNode, "Sorry our taxi drivers cannot go back in time.");
                }
            }
        }
    }
    if (document.getElementById("nameerror") == null && document.getElementById("phoneerror") == null && document.getElementById("streetnumerror") == null && document.getElementById("streeterror") == null && document.getElementById("suburberror") == null && document.getElementById("timeerror") == null) {
        var xhr = createRequest();
        var url = "methods.php?name=" + inputValues[0].value + "&phone=" + inputValues[1].value + "&unit=" + (inputValues[2].value ? inputValues[2].value : "NULL") + "&streetnum=" + inputValues[3].value + "&street=" + inputValues[4].value + "&suburb=" + inputValues[5].value + "&destsuburb=" + inputValues[6].value + "&time=" + inputValues[7].value;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
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

//Function to get the unassigned bookings
function getBookings(){
	if($("#unassigned-bookings").length){
		hideBookingTable(document.getElementById("hideBooking"));
		getBookings();
	}else{
		var xhr = createRequest();
		var url = "methods.php?getunassigned=True";
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status == 200){
				var x;
				if (xhr.responseText.length > 0){
					 x = JSON.parse(xhr.responseText);
				}else{
					x = undefined;
				}
				if(x){
					if(x.length > 0){
						var table = document.createElement("table");
						table.setAttribute("id", "unassigned-bookings");
						table.setAttribute("class", "table");
						var tableHead = document.createElement("THEAD");
						var tableBody = document.createElement("TBODY");
						var tableHeadRow = document.createElement("tr");
						var keys = Object.keys(x[0]);
						for (z in keys){
							var a = document.createElement("td");
							a.innerHTML =keys[z];
							tableHeadRow.appendChild(a);
						}
						for(y in x){
							var tr = document.createElement("tr");
							for (z in x[y]){
								var td = document.createElement("td");
								td.innerHTML = x[y][z];
								tr.appendChild(td);
							}
							tableBody.appendChild(tr);
						}
						tableHead.appendChild(tableHeadRow);
						table.appendChild(tableHead);
						table.appendChild(tableBody);
						var hideBookings = document.createElement("button");
						hideBookings.setAttribute("type", "button");
						hideBookings.setAttribute("class", "btn btn-default");
						hideBookings.setAttribute("onclick", "hideBookingTable(this)");
						hideBookings.setAttribute("id", "hideBooking");
						hideBookings.innerHTML =  "Hide Bookings";
						if($("#unassigned-bookings").length){}else{
							$('div').get(1).appendChild(hideBookings);
							$('div').get(1).appendChild(table);
						}
					}
				}else{
					alert("No Unassigned Bookings Currently.");
				}
			}
		}
		xhr.send(null);
	}
}

//Function called when trying to assign a taxi
//Prompt admin for input of booking ref then handle request
function assignTaxi() {
    var bookingref = prompt("Please Enter A Booking Reference Number.");
    if(bookingref){
        var xhr = createRequest();
        var url = "methods.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200){
                if(xhr.responseText == 'Success'){
                    hideBookingTable(document.getElementById("hideBooking"));
                    getBookings();
                    alert("The booking request "+bookingref+" has been properly assigned.");
                }else{
                    alert(xhr.responseText);
                }
            }
        }
        xhr.send("ref="+bookingref);
    }
}

//quick function to remove the table and the button of the bookings
function hideBookingTable(x){
    $("#unassigned-bookings").remove();
    $(x).remove();
}
