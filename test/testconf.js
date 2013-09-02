
var conf = require("../lib/conf.js");


function test_set(){
    var values = {
        username : "wangcheng",
        password : "890714"
    };
    conf.set(values);
}

function test_get(){
    var username = conf.getConf("username");
    console.log(username);
}

test_get();