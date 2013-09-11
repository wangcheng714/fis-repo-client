var Base64 = require('js-base64').Base64,
    request = require('request');

/**
 * Create or verify a user named <username> in the registry, and save the credentials to the .fisrc file.
 * @param username
 * @param password
 * @param email
 * @param cb
 */
module.exports = function(username, password, email, cb){
    var self = this, //回调函数的作用域不正确，思考是否可以使用bind，apply等解决方案
        _auth = Base64.encode((username + password).toString()),
        rand = Math.floor(Math.random()*100000000).toString(),
        url = 'http://localhost:3459/fisrepo/adduser?hash=' + rand + '&username=' + username + '&email=' + email + '&auth=' + _auth,
        emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;


    if(emailReg.test(email)){
        request(url, function(error, res, body){
            if(error){
                cb(err);
            }else{
                if(res.statusCode == 200){
                    self.conf.setConf({
                        username : username,
                        _auth : _auth
                    });
                    message = "Adduser success!";
                    cb(null, message);
                }else{
                    cb(body);
                }
            }
        });
    }else{
        cb("email 格式不正确");
    }
};