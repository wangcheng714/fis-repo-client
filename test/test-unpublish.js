
var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();

/**
 * 测试情况
 *   1. version 是latest
 *   2. version 不是latest
 *   3. version 为all
 *   4. version 不存在，报错
 *   5. 没有package发现
 */

var pkg = {
    name : "fis-cloud-app-ppt",
    version : "0.0.3"
};

client.unpublish(pkg, {}, function(error, message){
    if(!error){
        console.log(message);
    }else{
        console.log(error);
    }
});