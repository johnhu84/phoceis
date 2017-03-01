var http = require('http'), url = require('url'), queryString = require('querystring');
var baiduMap = require('baidumap');
var GeoPoint = require('geopoint');
/*var app = require('express');
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' }); 
app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');*/


//baidu map api key
//OQFpbN2jAA9woaiGvpFM2MmuImI6jIjW
var bdmap = baiduMap.create({'ak':'OQFpbN2jAA9woaiGvpFM2MmuImI6jIjW'});
var options = {'query':'天安门','region':'北京'};  
bdmap.search(options,function(err,reuslt){});

var fs = require('fs');
//google api key
//AIzaSyDmL2a4qVy57mPo8MkFO07mpqhMmpWhZsQ
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDmL2a4qVy57mPo8MkFO07mpqhMmpWhZsQ

var stores = JSON.parse(fs.readFileSync('starbucks_new_york.json', 'utf8'));

var server = http.createServer(function (req, res) {
    //get url infomation
    var urlParts = url.parse(req.url);
    console.log(req.url, urlParts);
 
    //direct the request to appropriate function to be processed based on the url pathname
    switch(urlParts.pathname) {
        case "/":
            displayForm(res);
            break;
        case "/search":
            search(req, res);
            break;
        default:
            displayForm(res);
            break;
	}
	/*var json = JSON.parse(fs.readFileSync('starbucks_new_york.json', 'utf8'));
	var destination = {"location": {"latitude":40.751014, "longitude":-73.990248}};

	json.sort(getSortFunction(destination));//req.get('query'));
	for (var i in json) {
		var location = json[i].location;
		console.log(json[i].name + ': ' + location.latitude + ' ' + location.longitude);
		//res.write(json[i].name + ': ' + location.latitude + ' ' + location.longitude);
	}*/
});

function getSortFunction(destination) {
	return function(store1, store2) {
		var from1 = new GeoPoint(store1.location.latitude, store1.location.longitude);
		var from2 = new GeoPoint(store2.location.latitude, store2.location.longitude);
		var to   = new GeoPoint(destination.location.latitude, destination.location.longitude);
		var dist1 = from1.distanceTo(to, true);
		var dist2 = from2.distanceTo(to, true);
		return dist1 > dist2;
	}
}

function search(req, res) {
	var query = queryString.parse(req.url.replace(/^.*\?/, ''));
	console.log(query);
	var lat = parseFloat(query.lat);
	var lng = parseFloat(query.lng);
	console.log("searching... lat: " + lat + ", lng: " + lng);
	res.writeHead(200, {"Content-Type": "application/json"});
	var location = { lat: lat, lng: lng };
	
	var destination = {"location": {"latitude":lat, "longitude":lng}};

	stores.sort(getSortFunction(destination));//req.get('query'));
	//var locations = stores.slice(0, 5);
	
	var json = JSON.stringify({ 
		location: location, 
		locations: JSON.stringify(stores)
	});
	res.end(json);
}

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
		
        res.end();
    });
}

function displayLocation(res) {
    fs.readFile('location.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

server.listen(1185);
console.log("server listening on 1185");