
/**
 * fis install package.json
 * fis install package
 * fis install package@version
 */

/**
 * todo :
 *  1. 对于已存在的缺少版本检测功能
 */
var fs = require("fs"),
    request = require('request'),
    AdmZip = require('adm-zip'),
    async = require('async'),
    path = require('path');

function downloadPkg(dir, component, options, callback){
    var self = this,
        rand = Math.floor(Math.random()*100000000).toString(),
        url = this.url + 'install?hash=' + rand,
        postBody = {
            component : component,
            params : options
        },
        requestOption = {
            url : url,
            method : "POST",
            json : postBody,
            encoding : null //默认request会将body转化成字符串传输，encoding设置为null则可以拿到buffer，放置zip格式被破坏
        },
        extractDir = dir + "/" + component.name;

    if(self.util.isDir(extractDir)){
        self.util.log("log", "Install notice : Component [" + component.name + "] already exist!", "yellow");
    }else{
        self.util.log("log", "Install start : Start download Component [" + component.name + "@" + component.version + "].", "white");
        request(requestOption, function(error, res, body){
            if(error){
                callback(error);
            }else{
                if(res.statusCode == 200){
                    var filename = res.headers["filename"],
                        filepath = dir + "/" + filename;
                    fs.writeFile(filepath, body, function(error){
                        if(!error){
                            self.util.log("log", "Install end : Finish download Component [" + component.name + "@" + component.version + "].", "white");
                            try{
                                var zipFile = new AdmZip(filepath);
                                zipFile.extractAllTo(extractDir, true);
                                self.util.del(filepath);
                            }catch(e){
                                callback('sorry, pkg is damaged. cannot unzip.');
                            }
                            self.util.del(filepath);
                            callback(null, "Component [" + component.name + "@" + component.version + "] Install Success.");
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
 * @param {Object} options     命令行参数
 * @param {Function} callback  回调函数，接受error,message两个参数
 */
module.exports = function(dir, component, options, callback){
    if(component){
        downloadPkg.call(this, dir, component, options, callback);
    }else{
        callback("Install must a component name or a package.json");
    }
};