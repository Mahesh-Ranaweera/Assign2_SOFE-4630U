var request = require('request-promise');
var wKEY = require('./config');

/**API calls from the plain text */
var getInfo = function(string, callback){
    //define regex for commands to use
    var regex = [/::get:weather/, /::note/];

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
        callback(null);
    }else{
        callback(null);
    }
}

function getWeather(location, callback){

    console.log('location:', location);
    //request URL
    const option = {
        method: 'GET',
        uri: "http://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID="+wKEY.weatherkey
    }
    
    request(option, function (err, resp, body) {
        //console.log(err, resp, body);
        if(err){
            callback(null);
        }else{
            callback(body);
        }
    });
}

module.exports.getInfo = getInfo;
