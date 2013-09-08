/**
 * Remove a component from the registry
 * @param {Object} component  component信息，必须包括name、version  || version为all时则全部删除
 * @param {Object} options  命令行参数
 * @param {Function} callback  回调函数，接受error,message两个参数
 */
//todo 增加错误处理能力
module.exports = function(component, options, callback){

    var op = 'unpublish',
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
        var errorMsg = "Must adduser first!";
        callback(errorMsg);
    }
};
