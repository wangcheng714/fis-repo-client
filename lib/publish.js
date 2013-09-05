/**
 * 检查是否有package.json文件
 *     如果有则读取
 *     没有则报错 需要添加package.json文件
 * 检查是否有fisrc是否记录有username和_auth
 *     如果有则读取username和_auth
 *     没有则报错 添加用户名
 *  构造userObj和pkgObj
 *      userObj {
 *          name
 *          _auth
 *      }
 *      pkgObj {
 *          name
 *          version
 *      }
 *      op ： publish、unpublish、
 */

var request = require("request"),
    fs = require("fs"),
    zlib = require("zlib"),
    archiver = require('archiver'), //todo 能否替换成adm-zip
    archive = archiver("zip");

module.exports = function(dir, options, callback){
    var self = this,
        op = 'publish',
        pkgFile = dir + "/package.json",
        auth = this.conf.getConf("_auth"),
        username = this.conf.getConf("username");

    if(this.util.exists(pkgFile)){
        var configJson = self.util.readJSON(pkgFile);
        if(username && auth){
            var user = {
                    name : username,
                    auth : auth
                },
                pkg = {
                    name : configJson.name,
                    version : configJson.version
                };
            self.login.hasAuth(user, pkg, op, options, function(error, message){
                if(error){
                    callback(error);
                }else{
                    //gz和tar.gz 都有问题，暂时只能使用zip，后续有时间了在看看具体原因
                    var files = self.util.find(dir),
                        pkgTgz = __dirname + "/" + pkg.name + "-" + pkg.version + ".zip",
                        tgzStream = fs.createWriteStream(pkgTgz);

                    archive.pipe(tgzStream);

                    archive.on('error', function(err) {
                        throw err;
                    });

                    for(var i=0; i<files.length; i++){
                        archive.append(fs.createReadStream(files[i]), {name : files[i].replace(dir, '')});
                    }

                    archive.finalize(function(error, written){
                        if(!error){
                            var url = "http://localhost:3459/fisrepo/publish";
                            var req = request.post(url, function(error, res, body){
                                if(error){
                                    callback(error);
                                }else{
                                    if(res.statusCode == 200){
                                        callback(null, body);
                                    }else{
                                        callback(body);
                                    }
                                }
                            });
                            var form = req.form();
                            form.append('file', fs.createReadStream(pkgTgz));
                            form.append('user_name', user.name);
                            form.append('config', JSON.stringify(configJson));
                        }else{
                            throw  error;
                        }
                    });

                }
            });
        }else{
            var errorMsg = "You must adduser first!";
            callback(errorMsg);
        }
    }else{
        var errorMsg = "Could not publish， missing file [package.json]";
        callback(errorMsg);
    }
};
