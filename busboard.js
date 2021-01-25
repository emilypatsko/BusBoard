function printDepartureInfo(departure) {
    let arr = [departure.line, departure.aimed_departure_time, "Expected:", departure.expected_departure_time, departure.direction];
    console.log(arr.join(' '));
}

function extractLatLong(info) {
    return {
        'postcodeLat': info.result.latitude,
        'postcodeLong': info.result.longitude
    }
}

function printDepartureBoard(atcocode) {
    var request = new XMLHttpRequest();
    var url = `http://transportapi.com/v3/uk/bus/stop/${atcocode}/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;

    request.open('GET', url, true)
    var response;

    request.onload = function () {
        // store all the requested data
        response = JSON.parse(request.responseText);

        // Extract the information on bus departures
        departures = response.departures;
    
        var departureBoard = [];

        for (let busRoute in departures) {
            departureBoard = departureBoard.concat(Object.values(departures[busRoute]));
        }       

        departureBoard.sort(function(a, b) {
            if (a.expected_departure_time < b.expected_departure_time) {
                return -1;
            } else if (a.expected_departure_time > b.expected_departure_time) {
                return 1;
            } else { 
                if (a.aimed_departure_time < b.aimed_departure_time) {
                    return -1;
                } else if (a.aimed_departure_time > b.aimed_departure_time) {
                    return 1;
                } else {
                    return 0;  
                }          
            }
        })

        console.log('\n');
        console.log(response.name);
        let i = 0;
        while (i < departureBoard.length && i < 5) {
            printDepartureInfo(departureBoard[i]);
            i++;
        }
    }

    request.send();
}

const prompt = require('prompt-sync')();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Get user to supply postcode
const postcode = prompt('Please enter a postcode: ');
// should put some error catching in here to make sure postcode is valid

var postcodeRequest = new XMLHttpRequest();
var postcodeUrl = 'http://api.postcodes.io/postcodes/' + postcode;

// use api.postcodes.io to get latitude and longitude
postcodeRequest.open('GET', postcodeUrl, true);
postcodeRequest.onload = function () {
    const postcodeResponse = JSON.parse(postcodeRequest.responseText);
    const location = extractLatLong(postcodeResponse);

    // use transport api to look up 2 nearest bus stops
    var busStopUrl = `http://transportapi.com/v3/uk/places.json?lat=${location.postcodeLat}&lon=${location.postcodeLong}&type=bus_stop&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f`;
    var stopRequest = new XMLHttpRequest();    
    stopRequest.open('GET', busStopUrl, true);
    stopRequest.onload = function () {
        var response = JSON.parse(stopRequest.responseText);

        // extract bus stop codes of 2 nearest bus stops
        var busStop1 = response.member[0].atcocode;
        var busStop2 = response.member[1].atcocode;

        // print departure board for each bus stop
        printDepartureBoard(busStop1);
        printDepartureBoard(busStop2);
    }
    stopRequest.send();

}

postcodeRequest.send();