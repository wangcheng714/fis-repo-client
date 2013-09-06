

var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();



function installByPackageName(){
    var dir = __dirname,
        pkg = {
            name : "fis-cloud-app-ppt",
            version : "0.0.2"
        },
        options = {
            deps : true
        };

    client.install(dir, pkg, null, options, function(error, content){
        console.log(error);
        console.log(content);
    });
}

function installByPackageJson(){
    var dir = __dirname,
        file = dir + "/package.json",
        pkg = null,
        options = {
            deps : true
        };

    client.install(dir, pkg, file, options, function(error, content){
        console.log(error);
        console.log(content);
    });
}

installByPackageJson();

