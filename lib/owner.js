/**
 * Manage component owners
 * @param component {Object} component信息，必须包括name、version
 * @param options   {Object} 命令行参数， 必须包括type，操作类型 add、rm、ls等
 * @param callback  {Function}  回调函数，接受error,message两个参数
 */
//todo ： owner add支持利用package.json，不用输入component名字
module.exports = function(component, options, callback){

    var op = 'owner',
        auth = this.conf.getConf("_auth"),
        username = this.conf.getConf("username");

    if(username && auth){
        var user = {
            name : username,
            auth : auth
        };
        this.login.hasAuth(user, component, op, options, function(error, message){
            callback(error, message);
        });
    }else{
        var errorMsg = "You must adduser first!";
        callback(errorMsg);
    }

};
