var request = require("request"),
    fs = require("fs"),
    zlib = require("zlib"),
    archiver = require('archiver'),
    archive = archiver("zip");

/**
 * publish a component
 * @param {String} dir  组件的目录
 * @param {Object} options 命令行参数  必须含有force 是否强制发布
 * @param {Function} callback 回调函数，接受error,message两个参数
 */
module.exports = function(dir, options, callback){
    var op = 'publish',
        pkgFile = dir + "/package.json",
        auth = this.conf.getConf("_auth"),
        username = this.conf.getConf("username");

    dir = this.util.realpath(dir);

    if(this.util.exists(pkgFile)){
        var configJson = this.util.readJSON(pkgFile);
        if(username && auth){
            var user = {
                    name : username,
                    _auth : auth
                },
                component = {
                    name : configJson.name,
                    version : configJson.version
                },
                postBody = {
                    user : user,
                    component : component,
                    options : options
                },
                rand = Math.floor(Math.random()*100000000).toString(),
                validate_url = this.url + "can_publish?hash=" + rand,
                publish_url = this.url + "publish?hash=" + rand,
                validate_requestOption = {
                    url : validate_url,
                    method : "POST",
                    json : postBody
                };

            request(validate_requestOption, function(error, res, body){
                if(error){
                    callback(error);
                }else{
                    if(res.statusCode == 200){
                        var files = this.util.find(dir),
                            pkgTgz = __dirname + "/" + component.name + "-" + component.version + ".zip",
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
                                var req = request.post(publish_url, function(error, res, body){
                                    if(this.util.isFile(pkgTgz)){
                                        this.util.del(pkgTgz);
                                    }
                                    if(error){
                                        callback(error);
                                    }else{
                                        if(res.statusCode == 200){
                                            callback(null, body);
                                        }else{
                                            callback(body);
                                        }
                                    }
                                }.bind(this));
                                var form = req.form();
                                form.append('file', fs.createReadStream(pkgTgz));
                                form.append('user_name', user.name);
                                form.append('config', JSON.stringify(configJson));
                            }else{
                                throw  error;
                            }
                        }.bind(this));
                    }else{
                        callback(body);
                    }
                }
            }.bind(this));

        }else{
            callback("You must adduser first!");
        }
    }else{
        callback("Could not publish， missing file [" + dir + "/package.json]");
    }
};
