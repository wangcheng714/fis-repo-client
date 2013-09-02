
var login = require("../lib/login.js");

function testLoginOk(){
    login.exist("wangcheng", "d2FuZ2NoZW5nODkwNzE0", function(error, message){
        if(!error){
            console.log("success" + message);
        }else{
            console.log("error" + error);
        }
    });
}
testLoginOk();

function testLoginWrong(){
    login.exist("wangcheng");
}
//testLoginWrong();