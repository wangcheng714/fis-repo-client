
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
/**
 * todo :
 *  1. 对于已存在的缺少版本检测功能
 *  2. 脚手架功能支持
 *
 */
var fs = require("fs"),
    request = require('request'),
    AdmZip = require('adm-zip'),
    async = require('async'),
    path = require('path');

function downloadPkg(param, callback){
    var self = this,
        dir = param.dir,
        pkg = param.pkg,
        options = param.options,
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
        self.util.log("log", "Install notice : Component [" + pkg.name + "] already exist!", "yellow");
    }else{
        self.util.log("log", "Install start : Start download Component [" + pkg.name + "@" + pkg.version + "].", "white");
        request(requestOption, function(error, res, body){
            if(error){
                callback(error);
            }else{
                if(res.statusCode == 200){
                    var filename = res.headers["filename"],
                        filepath = dir + "/" + filename;
                    fs.writeFile(filepath, body, function(error){
                        if(!error){
                            self.util.log("log", "Install end : Finish download Component [" + pkg.name + "@" + pkg.version + "].", "white");
                            var zipFile = new AdmZip(filepath);
                            zipFile.extractAllTo(extractDir, true);
                            if(self.util.isFile(filepath)){
                                self.util.del(filepath);
                            }
                            callback(null, "Component [" + pkg.name + "@" + pkg.version + "] Install Success.");
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

/**
 * Install a component
 * @param {String} dir         The dir component install to
 * @param {Object} component   component信息，必须包括name、version
 * @param {String} configFile  config文件的路径
 * @param {Object} options     命令行参数
 * @param {Function} callback  回调函数，接受error,message两个参数
 */
module.exports = function(dir, component, configFile, options, callback){
    if(component){
        var param = {
            dir : dir,
            pkg : component,
            options : options
        };
        downloadPkg.call(this, param, callback);
    }else if(this.util.isFile(configFile)){
        var config = this.util.readJSON(configFile),
            dependencies = config.dependencies,
            params = [];
        for(var pkgname in dependencies){
            if(dependencies.hasOwnProperty(pkgname)){
                var param = {
                    dir : dir,
                    options : options,
                    pkg : {
                        name : pkgname,
                        version : dependencies[pkgname]
                    }
                };
                params.push(param);
            }
        }
        async.each(params, downloadPkg.bind(this), function(error, result){
            console.log(error);
            console.log(result);
        });
    }else{
        var error = "Install must a component name or a package.json";
        callback(error);
    }
};