/**
 * 回调函数格式参数 ：
 *
 *  error， data
 *
 * adduser 流程 ：
 *   fis-command-adduser ：
 *      1. 命令行接受username、password
 *      2. 利用username、password生成 username和auth，调用fis-repo-client的adduser方法
 *   fis-repo-client：
 *      adduser ： (usrename、password、回调函数)
 *          根据请求返回结果判断用户是否存在
 *              存在 ： 存贮username 和 auth到fisrc文件中 ,  返回message adduser成功
 *              不存在 : 抛出错误信息， 用户名或者密码不正确
 *
 *    fis-command-adduser ：
 *      接收到adduser返回信息展示在命令行中
 */

var Base64 = require('js-base64').Base64;

/**
 * Create or verify a user named <username> in the registry, and save the credentials to the .fisrc file.
 * @param username
 * @param password
 * @param cb
 */
module.exports = function(username, password, cb){
    var self = this, //回调函数的作用域不正确，思考是否可以使用bind，apply等解决方案
        _auth = Base64.encode((username + password).toString());
    this.login.exist(username, _auth, function(error, message){
        if(error){
            cb(error);
        }else{
            self.conf.setConf({
                username : username,
                _auth : _auth
            });
            message = "Adduser success!";
            cb(error, message);
        }
    });
};