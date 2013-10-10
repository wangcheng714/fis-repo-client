module.exports = RepoClient;

function RepoClient(domain, port){
    this.url = "http://" + domain + ":" + port + "/fisrepo/cli_";
}

require('fs').readdirSync(__dirname + "/lib").forEach(function (f) {
    if (!f.match(/\.js$/)) return;
    RepoClient.prototype[f.replace(/\.js$/, '')] = require('./lib/' + f);
});
