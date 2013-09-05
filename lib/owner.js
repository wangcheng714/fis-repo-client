
module.exports = function(pkg, options, callback){

    var op = 'owner',
        auth = this.conf.getConf("_auth"),
        username = this.conf.getConf("username");

    if(username && auth){
        var user = {
            name : username,
            auth : auth
        };
        this.login.hasAuth(user, pkg, op, options, function(error, message){
            callback(error, message);
        });
    }else{
        var errorMsg = "You must adduser first!";
        callback(errorMsg);
    }

};
