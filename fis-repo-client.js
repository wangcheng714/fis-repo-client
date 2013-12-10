module.exports = RepoClient;

function RepoClient(repos){
    var reg = /^http:\/\/(.*)/i;
    if(!repos.match(reg)){
        repos = "http://" + repos;
    }
    this.url = repos + "/repos/cli_";
}

require('fs').readdirSync(__dirname + "/lib").forEach(function (f) {
    if (!f.match(/\.js$/)) return;
    RepoClient.prototype[f.replace(/\.js$/, '')] = require('./lib/' + f);
});
