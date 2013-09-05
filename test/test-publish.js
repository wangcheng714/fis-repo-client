
var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();

client.publish("D:/work/fis-cloud/fis-cloud-app-ppt", {}, function(error, message){
    if(error){
        console.log(error);
    }else{
        console.log(message);
    }
});
