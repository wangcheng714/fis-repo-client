var request = require('request');

/**
 *
 * @param username
 * @param _auth
 * @param cb
 */
exports.exist = function(username, _auth, cb){
    var rand = Math.floor(Math.random()*100000000).toString(),
        url = 'http://localhost:3459/fisrepo/exist?hash=' + rand + '&username=' + username + '&auth=' + _auth;
    request(url, function(error, res, body){
        if(res.statusCode == 200) {
            cb(error, body);
        }else{
            cb(body);
        }
    });
};

exports.hasAuth = function(op, package_name){
    //读取conf中的username和_auth,发送hasAuth get请求

};