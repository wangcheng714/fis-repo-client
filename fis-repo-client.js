/**
 *  fis home : 打开package的主页
 *  fis init : 帮助生成package.json文件
 */

module.exports = RepoClient;

function RepoClient(){
    this.url = "http://localhost:3459/fisrepo/";
}

require('fs').readdirSync(__dirname + "/lib").forEach(function (f) {
    if (!f.match(/\.js$/)) return;
    RepoClient.prototype[f.replace(/\.js$/, '')] = require('./lib/' + f)
});