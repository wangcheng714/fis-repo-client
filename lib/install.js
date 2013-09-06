/**
 * fis install package.json
 * fis install package
 * fis install package@version
 */

/**
 * 检测当前目录是否存在同版本
 *      不存在 继续下面操作
 *      存在 ：
 *          notice 下载的component已经存在
 *
 * 查找包是否存在 ：
 *      存在
 *          查看版本是否存在
 *              存在
 *
 *              不存在 ： 报错提示版本不存在
 *      不存在则报错
 *
 */
var fs = require("fs"),
    request = require('request'),
    AdmZip = require('adm-zip');

function downloadPkg(dir, pkg, options, callback){
    var self = this,
        rand = Math.floor(Math.random()*100000000).toString(),
        url = 'http://localhost:3459/fisrepo/download?hash=' + rand,
        postBody = {
            pkg : pkg,
            params : options
        },
        requestOption = {
            url : url,
            method : "POST",
            json : postBody,
            encoding : null //默认request会将body转化成字符串传输，encoding设置为null则可以拿到buffer，放置zip格式被破坏
        },
        extractDir = dir + "/" + pkg.name;

    if(self.util.isDir(extractDir)){
        console.log("Package [" + pkg.name + "] already exist!");
    }else{
        console.log("start downloading component [" + pkg.name + "].");
        request(requestOption, function(error, res, body){
            if(error){
                callback(error);
            }else{
                if(res.statusCode == 200){
                    var filename = res.headers["filename"],
                        filepath = dir + "/" + filename;
                    fs.writeFile(filepath, body, function(error){
                        if(!error){
                            console.log("Finish downloading package [" + pkg.name + "]");
                            var zipFile = new AdmZip(filepath);
                            zipFile.extractAllTo(extractDir, true);
                            if(options.deps){
                                var packageJson = extractDir + "/package.json";
                                if(self.util.isFile(packageJson)){
                                    var config = self.util.readJSON(packageJson),
                                        dependencies = config.dependencies;
                                    for(var pkgname in dependencies){
                                        if(dependencies.hasOwnProperty(pkgname)){
                                            var subPkg = {
                                                    name : pkgname,
                                                    version : dependencies[pkgname]
                                                },
                                                subDir = dir,
                                                subOptions = options,
                                                subCallback = callback;
                                            downloadPkg.call(self, subDir, subPkg, subOptions, subCallback);
                                        }
                                    }
                                }
                            }
                        }else{
                            callback(error);
                        }
                    });

                }else{
                    callback(body);
                }
            }
        });
    }
}

module.exports = install = function(dir, pkg, configFile, options, callback){
    if(pkg){
        downloadPkg.call(this, dir, pkg, options, callback);
    }else if(this.util.isFile(configFile)){
        var config = this.util.readJSON(configFile),
            dependencies = config.dependencies;
        for(var pkgname in dependencies){
            if(dependencies.hasOwnProperty(pkgname)){
                var subPkg = {
                        name : pkgname,
                        version : dependencies[pkgname]
                    },
                    subDir = dir,
                    subOptions = options,
                    subCallback = callback;
                downloadPkg.call(this, subDir, subPkg, subOptions, subCallback);
            }
        }
    }else{
        var error = "install must a package name or a package.json";
        callback(error);
    }
};


