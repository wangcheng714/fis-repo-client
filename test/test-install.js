

var RepoClient = require("../fis-repo-client.js"),
    client = new RepoClient();

var dir = __dirname,
    pkg = {
        name : "fis-cloud-app-ppt",
        version : "0.0.2"
    },
    options = {

    };

client.install(dir, pkg, options, function(error, content){
    console.log(error);
    console.log(content);
});
