
var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();

//client.adduser("wangcheng", "890714", function(error, message){
//    if(error){
//        console.log(error);
//    }else{
//        console.log(message);
//    }
//});

client.adduser("wangcheng723", "890714", function(error, message){
    if(error){
        console.log(error);
    }else{
        console.log(message);
    }
});
