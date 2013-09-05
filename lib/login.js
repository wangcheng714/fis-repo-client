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
        if(error){
            cb(error);
        }else{
            if(res.statusCode == 200) {
                cb(error, body);
            }else{
                cb(body);
            }
        }
    });
};

/**
 * 验证用户是否对组件有操作权限
 * @param userObj
 * @param pkgObj
 * @param op
 * @param params
 * @param cb
 */
exports.hasAuth = function(userObj, pkgObj, op, params, cb){
    //读取conf中的username和_auth,发送hasAuth get请求
    var rand = Math.floor(Math.random()*100000000).toString(),
        url = 'http://localhost:3459/fisrepo/hasAuth?hash=' + rand,
        postBody = {
            user : userObj,
            pkg : pkgObj,
            op : op,
            params : params
        },
        requestOption = {
            url : url,
            method : "POST",
            json : postBody
        };

    request(requestOption, function(error, res, body){
        if(error){
            cb(error);
        }else{
            if(res.statusCode == 200){
                cb(error, body);
            }else{
                cb(body);
            }
        }
    });

};

