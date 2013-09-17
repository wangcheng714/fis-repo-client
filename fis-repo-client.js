module.exports = RepoClient;

function RepoClient(){
    this.url = "http://localhost:3459/fisrepo/cli_";
}

require('fs').readdirSync(__dirname + "/lib").forEach(function (f) {
    if (!f.match(/\.js$/)) return;
    RepoClient.prototype[f.replace(/\.js$/, '')] = require('./lib/' + f);
});