
var login = require("../lib/login.js");

function testExistOk(){
    login.exist("wangcheng", "d2FuZ2NoZW5nODkwNzE0", function(error, message){
        if(!error){
            console.log("success" + message);
        }else{
            console.log("error" + error);
        }
    });
}
//testExistOk();

function testExistWrong(){
    login.exist("wangcheng");
}
//testExistWrong();



function testHasAuthOk(){
    var userObj = {
            name : "wangcheng",
            auth : "d2FuZ2NoZW5nODkwNzE0"
        },
        pkgObj = {
            name : "fis-app-cloud-ppt",
            version : "0.1.2"
        },
        op = 'publish',
        params = {

        };

    login.hasAuth(userObj, pkgObj, op, params, function(error, message){
        if(error){
            console.log(error);
        }else{
            console.log(message);
        }
    });

}

testHasAuthOk();