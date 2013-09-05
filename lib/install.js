/**
 * fis install package.json
 * fis install package
 * fis install package@version
 */

/**
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

module.exports = function(dir, pkg, options, callback){
    var rand = Math.floor(Math.random()*100000000).toString(),
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
        };

    request(requestOption, function(error, res, body){
        if(error){
            callback(error);
        }else{
            if(res.statusCode == 200){
                var filename = res.headers["filename"],
                    filepath = dir + "/" + filename;

                fs.writeFile(filepath, body, function(error){
                    if(!error){
                        var zipFile = new AdmZip(filepath),
                            destDir = dir + "/" + pkg.name;
                        zipFile.extractAllTo(destDir, true);
                    }else{
                        callback(error);
                    }
                });

            }else{
                callback(body);
            }
        }
    });
};

