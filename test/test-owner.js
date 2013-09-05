
var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();



function test_add(){
    /**
     * add测试
     * 测试情况一 ： 用户存在
     * 测试情况二 ： 用户不存在
     * 测试情况三 ： 同一用户重复多次
     */
    var pkg = {
            name : "fis-cloud-app-ppt",
            version : "latest"
        },
        options = {
            type : "add",
            username : "zhangsan"
        };

    client.owner(pkg, options, function(error, message){
        console.log(error);
        console.log(message);
    });
}

function test_remove(){
    /**
     * add测试
     * 测试情况一 ： 用户存在
     * 测试情况二 ： 用户不存在
     * 测试情况三 ： 同一用户重复多次
     */
    var pkg = {
            name : "fis-cloud-app-ppt",
            version : "latest"
        },
        options = {
            type : "rm",
            username : "zhangsan"
        };

    client.owner(pkg, options, function(error, message){
        console.log(error);
        console.log(message);
    });
}

test_remove();

