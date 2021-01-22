function printDepartureInfo(departure) {
    let arr = [departure.line, departure.aimed_departure_time, "Expected:", departure.expected_departure_time, departure.direction];
    console.log(arr.join(' '));
}

function extractDepartureInfo(departure) {

}

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const prompt = require('prompt-sync')();

// Get bus stop code
const busStop = prompt('Please enter a bus stop code: ');

var request = new XMLHttpRequest();
var url = 'http://transportapi.com/v3/uk/bus/stop/' + busStop + '/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f';

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

    let i = 0;
    while (i < departureBoard.length && i < 5) {
        printDepartureInfo(departureBoard[i]);
        i++;
    }
}

request.send();
 
