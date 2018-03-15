var request = require('request-promise');
var wKEY = require('./config');

/**API calls from the plain text */
var getInfo = function(string, callback){
    //define regex for commands to use
    var regex = [/::get:weather/, /::note:create/];

    command = {
        reg: null,
        num: 0
    };

    //split words
    var wordarr = string.split(" ");

    //select the next words to find location
    if(regex[0].test(wordarr[0])){
        getWeather(wordarr[1], function(data){
            callback(data);
        })
    }else if(regex[1].test(wordarr[0])){
        //remove the cmd from the arr
        wordarr.shift();
        //append rest of the string with space and send the payload
        var payload = {
            tag: 'note',
            content: {
                note: wordarr.join(" ")
            }
        }
        callback(payload);
    }else{
        callback(null);
    }
}

//get the current weather from openweathermap api
function getWeather(location, callback){
    //console.log('location:', location);
    //request URL
    const option = {
        method: 'GET',
        uri: "http://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID="+wKEY.keys.weatherkey
    }
    
    request(option, function (err, resp, body) {
        //console.log(err, resp, body);
        if(err){
            callback(null);
        }else{
            var jsondata = JSON.parse(body);
            console.log(body, resp, err);
            
            if(jsondata.cod != "404" || resp.statusCode != 404){
                var payload = {
                    tag: 'weather',
                    content: {
                        city: jsondata.name,
                        temp: jsondata.main.temp,
                        w: jsondata.weather[0].main,
                        wdesc: jsondata.weather[0].description
                    }
                }
                callback(payload);
            }else{
                callback(null);
            }
        }
    });
}

module.exports.getInfo = getInfo;
