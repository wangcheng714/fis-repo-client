var request = require('request');

module.exports = function(query, callback){
	var url = 'http://localhost:3459/fisrepo/search?q='+ query;
    request(url, function(error, res, body){
        if (error) {
            callback(error);
        }else{
            callback(null, body);
        }
    });
};