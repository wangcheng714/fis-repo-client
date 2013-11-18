var request = require("request"),
    fs = require("fs"),
    zlib = require("zlib"),
    archiver = require('archiver'),
    ignore = require("ignore")(),
    archive = archiver("zip");

/**
 * publish a component
 * @param {String} dir  组件的目录
 * @param {Object} options 命令行参数  必须含有force 是否强制发布
 * @param {Function} callback 回调函数，接受error,message两个参数
 */
module.exports = function(dir, options, callback){
    var pkgFile = dir + "/package.json",
        auth = this.conf.getConf("_auth"),
        email = this.conf.getConf("email"),
        username = this.conf.getConf("username"),
        ignoreFiles = ['.ignore', '.gitignore', '.npmignore', '.lightignore'];

    dir = this.util.realpath(dir);

    if(this.util.exists(pkgFile)){
        var configJson = this.util.readJSON(pkgFile);
        if(username && auth){
            var user = {
                    name : username,
                    email : email,
                    _auth : auth
                },
                component = {
                    name : configJson.name,
                    version : configJson.version
                },
                postBody = {
                    user : user,
                    email : email,
                    component : component,
                    options : options
                },
                rand = Math.floor(Math.random()*100000000).toString(),
                validate_url = this.url + "publish_auth?hash=" + rand,
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
                        var files = ignore.addIgnoreFiles(ignoreFiles).filter(this.util.find(dir)),
                        componentZip = __dirname + "/" + component.name + "-" + component.version + ".zip",
                        componentStream = fs.createWriteStream(componentZip);

                        var readme = getReadFile.call(this, dir);

                        archive.pipe(componentStream);

                        archive.on('error', function(err) {
                            callback(err);
                        });

                        for(var i=0; i<files.length; i++){
                            archive.append(fs.createReadStream(files[i]), {name : files[i].replace(dir, '')});
                        }

                        archive.finalize(function(error, written){
                            if(!error){
                                var req = request.post(publish_url, function(error, res, body){
                                    if(this.util.isFile(componentZip)){
                                      //  this.util.del(componentZip);
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
                                if(readme){
                                    form.append('readme', fs.createReadStream(readme));
                                }
                                form.append('file', fs.createReadStream(componentZip));
                                form.append('user_name', user.name);
                                form.append('email', user.email);
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
        callback("Could not publish, missing file [" + dir + "/package.json]");
    }
};

function getReadFile(dir){
    var files = ["README.md", 'readme.md', 'README', 'readme'];
    for(var i=0; i<files.length; i++){
        var file = dir + "/" + files[i];
        if(this.util.isFile(file)){
            return file;
        }
    }
    return null;
}
