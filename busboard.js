var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var request = new XMLHttpRequest();

request.open('GET', 'http://transportapi.com/v3/uk/bus/stop/490008660N/live.json?group=route&app_id=97d91d05&app_key=b77e693ec08272f32658588da099e89f', true)

var response;

request.onload = function () {
    // do something with the retrieved data, stored in request.response
    response = JSON.parse(request.responseText);
    departures = response.departures;

    for (let busRoute in departures) {
        departures[busRoute].forEach(departure => 
            console.log([departure.line, departure.direction, departure.expected_departure_time].join(' '))
            );
    }       
}

request.send();
 
