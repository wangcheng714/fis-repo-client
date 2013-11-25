
var fs = require('fs'),
    pth = require('path'),
    request = require('request'),
    _exists = fs.existsSync || pth.existsSync,
    toString = Object.prototype.toString,
    log = require("./log.js"),
    iconv;

var IS_WIN = process.platform.indexOf('win') === 0;

var TEXT_FILE_EXTS = [
        'css', 'tpl', 'js', 'php',
        'txt', 'json', 'xml', 'htm',
        'text', 'xhtml', 'html', 'md',
        'conf', 'po', 'config', 'tmpl',
        'coffee', 'less', 'sass', 'jsp',
        'scss', 'manifest', 'bak', 'asp',
        'tmp', 'haml', 'jade'
    ],
    IMAGE_FILE_EXTS = [
        'svg', 'tif', 'tiff', 'wbmp',
        'png', 'bmp', 'fax', 'gif',
        'ico', 'jfif', 'jpe', 'jpeg',
        'jpg', 'woff', 'cur'
    ];

function getIconv(){
    if(!iconv){
        iconv = require('iconv-lite');
    }
    return iconv;
}

var _ = module.exports = function(){};

_.is = function(source, type){
    return toString.call(source) === '[object ' + type + ']';
};

_.map = function(obj, callback, merge){
    var index = 0;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            if(merge){
                callback[key] = obj[key];
            } else if(callback(key, obj[key], index++)) {
                break;
            }
        }
    }
};

_.pad = function(str, len, fill, pre){
    if(str.length < len){
        fill = (new Array(len)).join(fill || ' ');
        if(pre){
            str = (fill + str).substr(-len);
        } else {
            str = (str + fill).substring(0, len);
        }
    }
    return str;
};

_.merge = function(source, target){
    if(_.is(source, 'Object') && _.is(target, 'Object')){
        _.map(target, function(key, value){
            source[key] = _.merge(source[key], value);
        });
    } else {
        source = target;
    }
    return source;
};

_.clone = function(source) {
    var ret;
    switch(toString.call(source)){
        case '[object Object]':
            ret = {};
            _.map(source, function(k, v){
                ret[k] = _.clone(v);
            });
            break;
        case '[object Array]':
            ret = [];
            source.forEach(function(ele){
                ret.push(_.clone(ele));
            });
            break;
        default :
            ret = source;
    }
    return ret;
};

_.escapeReg = function(str){
    return str.replace(/[\.\\\+\*\?\[\^\]\$\(\){}=!<>\|:\/]/g, '\\$&');
};

_.escapeShellCmd = function(str){
    return str.replace(/ /g, '"$&"');
};

_.escapeShellArg = function(cmd){
    return '"' + cmd + '"';
};

_.stringQuote = function(str, quotes, trim){
    var info = {
        origin : str,
        rest   : str,
        quote  : ''
    };
    if(trim !== false) {
        str = str.trim();
    }
    if(str){
        quotes = quotes || '\'"';
        var strLen = str.length - 1;
        for(var i = 0, len = quotes.length; i < len; i++){
            var c = quotes[i];
            if(str[0] === c && str[strLen] === c){
                info.quote = c;
                info.rest  = str.substring(1, strLen);
                break;
            }
        }
    }
    return info;
};

_.exists = _exists;
_.fs = fs;

_.realpath = function(path){
    if(path && _exists(path)){
        path = fs.realpathSync(path);
        if(IS_WIN){
            path = path.replace(/\\/g, '/');
        }
        if(path !== '/'){
            path = path.replace(/\/$/, '');
        }
        return path;
    } else {
        return false;
    }
};

_.realpathSafe = function(path){
    return _.realpath(path) || _(path);
};

_.isAbsolute = function(path) {
    if (IS_WIN) {
        return /^[a-z]:/i.test(path);
    } else {
        if(path === '/'){
            return true;
        } else {
            var split = path.split('/');
            if(split[0] === '~'){
                return true;
            } else if(split[0] === '' && split[1]) {
                return _.isDir('/' + split[1] + '/' + split[2]);
            } else {
                return false;
            }
        }
    }
};

_.isFile = function(path){
    return _exists(path) && fs.statSync(path).isFile();
};

_.isDir = function(path){
    return _exists(path) && fs.statSync(path).isDirectory();
};

_.mtime = function(path){
    var time = 0;
    if(_exists(path)){
        time = fs.statSync(path).mtime;
    }
    return time;
};

_.touch = function(path, mtime){
    if(!_exists(path)){
        _.write(path, '');
    }
    if(mtime instanceof Date){
        //do nothing for quickly determining.
    } else if(typeof mtime === 'number') {
        var time = new Date();
        time.setTime(mtime);
        mtime = time;
    } else {
        log.error('invalid argument [mtime]');
    }
    fs.utimesSync(path, mtime, mtime);
};

_.isWin = function(){
    return IS_WIN;
};

function getFileTypeReg(type){
    var map = [];
    if(type === 'text'){
        map = TEXT_FILE_EXTS;
    } else if(type === 'image'){
        map = IMAGE_FILE_EXTS;
    } else {
        log.error('invalid file type [' + type + ']');
    }
    map = map.join('|');
    return new RegExp('\\.(?:' + map + ')$', 'i');
}

_.isTextFile = function(path){
    return getFileTypeReg('text').test(path || '');
};

_.isImageFile = function(path){
    return getFileTypeReg('image').test(path || '');
};

_.mkdir = function(path, mode){
    if (typeof mode === 'undefined') {
        //511 === 0777
        mode = 511 & (~process.umask());
    }
    if(_exists(path)) return;
    path.split('/').reduce(function(prev, next) {
        if(prev && !_exists(prev)) {
            fs.mkdirSync(prev, mode);
        }
        return prev + '/' + next;
    });
    if(!_exists(path)) {
        fs.mkdirSync(path, mode);
    }
};

_.toEncoding = function(str, encoding){
    return getIconv().toEncoding(String(str), encoding);
};

_.isUtf8 = function(bytes) {
    var i = 0;
    while(i < bytes.length) {
        if((// ASCII
            bytes[i] == 0x09 ||
                bytes[i] == 0x0A ||
                bytes[i] == 0x0D ||
                (0x20 <= bytes[i] && bytes[i] <= 0x7E)
            )) {
            i += 1;
            continue;
        }

        if((// non-overlong 2-byte
            (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
                (0x80 <= bytes[i+1] && bytes[i+1] <= 0xBF)
            )) {
            i += 2;
            continue;
        }

        if(
            (// excluding overlongs
                bytes[i] == 0xE0 &&
                    (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                    (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
                ) || (// straight 3-byte
                ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
                    bytes[i] == 0xEE ||
                    bytes[i] == 0xEF) &&
                    (0x80 <= bytes[i + 1] && bytes[i+1] <= 0xBF) &&
                    (0x80 <= bytes[i+2] && bytes[i+2] <= 0xBF)
                ) || (// excluding surrogates
                bytes[i] == 0xED &&
                    (0x80 <= bytes[i+1] && bytes[i+1] <= 0x9F) &&
                    (0x80 <= bytes[i+2] && bytes[i+2] <= 0xBF)
                )
            ) {
            i += 3;
            continue;
        }

        if(
            (// planes 1-3
                bytes[i] == 0xF0 &&
                    (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                    (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                    (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
                ) || (// planes 4-15
                (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
                    (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                    (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                    (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
                ) || (// plane 16
                bytes[i] == 0xF4 &&
                    (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
                    (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                    (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
                )
            ) {
            i += 4;
            continue;
        }
        return false;
    }
    return true;
};

_.readBuffer = function(buffer){
    if(_.isUtf8(buffer)){
        buffer = buffer.toString('utf8');
        if (buffer.charCodeAt(0) === 0xFEFF) {
            buffer = buffer.substring(1);
        }
    } else {
        buffer = getIconv().decode(buffer, 'gbk');
    }
    return buffer;
};

_.read = function(path, convert){
    var content = false;
    if(_exists(path)){
        content = fs.readFileSync(path);
        if(convert || _.isTextFile(path)){
            content = _.readBuffer(content);
        }
    } else {
        log.error('unable to read file[' + path + ']: No such file or directory.');
    }
    return content;
};

_.write = function(path, data, charset, append){
    if(!_exists(path)){
        _.mkdir(_.pathinfo(path).dirname);
    }
    if(charset){
        data = getIconv().encode(data, charset);
    }
    if(append) {
        fs.appendFileSync(path, data, null);
    } else {
        fs.writeFileSync(path, data, null);
    }
};

_.filter = function(str, include, exclude){
    if(typeof include === 'string'){
        include = _.glob(include);
    }
    if(typeof exclude === 'string'){
        exclude = _.glob(exclude);
    }
    return !((!!include && str.search(include) < 0) || (!!exclude && str.search(exclude) > -1));
};

_.find = function(rPath, include, exclude){
    var list = [],
        path = _.realpath(rPath);
    if(path){
        var stat = fs.statSync(path);
        if(stat.isDirectory()){
            fs.readdirSync(path).forEach(function(p){
                if(p[0] != '.') {
                    list = list.concat(_.find(path + '/' + p, include, exclude));
                }
            });
        } else if(stat.isFile() && _.filter(path, include, exclude)) {
            list.push(path);
        }
    } else {
        log.error('unable to find [' + rPath + ']: No such file or No such file or directory.');
    }
    return list.sort();
};

_.del = function(rPath, include, exclude){
    var removedAll = true,
        path = _.realpath(rPath);
    if(path) {
        if(/^(?:\w:)?\/$/.test(path)){
            log.error('unable to delete directory [' + rPath + '].');
        }
        var stat = fs.statSync(path);
        if(stat.isDirectory()){
            fs.readdirSync(path).forEach(function(name){
                if(name != '.' && name != '..') {
                    removedAll = _.del(path + '/' + name, include, exclude) && removedAll;
                }
            });
            if(removedAll) {
                fs.rmdirSync(path);
            }
        } else if(stat.isFile() && _.filter(path, include, exclude)) {
            fs.unlinkSync(path);
        } else {
            removedAll = false;
        }
    } else {
        //this.log.error('unable to delete [' + rPath + ']: No such file or No such file or directory.');
    }
    return removedAll;
};

_.copy = function(rSource, target, include, exclude, uncover, move){
    var removedAll = true,
        source = _.realpath(rSource);
    target = _(target);
    if(source){
        var stat = fs.statSync(source);
        if(stat.isDirectory()){
            fs.readdirSync(source).forEach(function(name){
                if(name != '.' && name != '..') {
                    removedAll = _.copy(
                        source + '/' + name,
                        target + '/' + name,
                        include, exclude,
                        uncover, move
                    ) && removedAll;
                }
            });
            if(move && removedAll) {
                fs.rmdirSync(source);
            }
        } else if(stat.isFile() && _.filter(source, include, exclude)){
            if(uncover && _exists(target)){
                //uncover
                removedAll = false;
            } else {
                _.write(target, fs.readFileSync(source, null));
                if(move) {
                    fs.unlinkSync(source);
                }
            }
        } else {
            removedAll = false;
        }
    } else {
        log.error('unable to copy [' + rSource + ']: No such file or No such file or directory.');
    }
    return removedAll;
};

_.ext = function(str){
    var info = _.query(str), pos;
    str = info.fullname = info.rest;
    if((pos = str.lastIndexOf('/')) > -1){
        if(pos === 0){
            info.rest = info.dirname = '/';
        } else {
            info.dirname = str.substring(0, pos);
            info.rest = info.dirname + '/';
        }
        str = str.substring(pos + 1);
    } else {
        info.rest = info.dirname = '';
    }
    if((pos = str.lastIndexOf('.')) > -1){
        info.ext = str.substring(pos).toLowerCase();
        info.filename = str.substring(0, pos);
        info.basename = info.filename + info.ext;
    } else {
        info.basename = info.filename = str;
        info.ext = '';
    }
    info.rest += info.filename;
    return info;
};

_.query = function(str){
    var rest = str,
        pos = rest.indexOf('?'),
        query = '';
    if(pos > -1){
        query = rest.substring(pos);
        rest  = rest.substring(0, pos);
    }
    rest = rest.replace(/\\/g, '/');
    if(rest !== '/'){
        rest = rest.replace(/\/\.?$/, '');
    }
    return {
        origin : str,
        rest : rest,
        query : query
    };
};

_.pathinfo = function(path){
    //can not use _() method directly for the case _.pathinfo('a/').
    var type = typeof path;
    if(arguments.length > 1) {
        path = Array.prototype.join.call(arguments, '/');
    } else if(type === 'string') {
        //do nothing for quickly determining.
    } else if(type === 'object') {
        path = Array.prototype.join.call(path, '/');
    }
    return _.ext(path);
};

_.readJSON = function(path){
    var json = _.read(path),
        result = {};
    try {
        result = JSON.parse(json);
    } catch(e){
        log.error('parse json file[' + path + '] fail, error [' + e.message + ']');
    }
    return result;
};

/**
 *
 * @param {String} type log的类型：error和log
 * @param {String} message log的内容
 * @param {String} color  log的颜色：black、red、green、yellow、blue、purple、white
 * @param {Boolean} exit  是否终止程序
 */
//todo : log方法重构，参照jam中的颜色处理方案
_.log = function(type, message, color, exit){
    color = color.toLowerCase();
    switch(color){
        case "black":
            color = 30;
            break;
        case "red":
            color = 31;
            break;
        case "green":
            color = 32;
            break;
        case "yellow":
            color = 33;
            break;
        case "blue":
            color = 34;
            break;
        case "purple":
            color = 35;
            break;
        case "white":
            color = 37;
            break;
        default :
            color = 37;
            break;
    }
    var templateStr = "\033[" + color + "m%s\033[m ";
    if(type == "error"){
        console.error(templateStr, message);
    }else{
        console.log(templateStr, message);
    }
    if(exit){
        process.exit(1);
    }
};

var Constants = {
    /* The local file header */
    LOCHDR           : 30, // LOC header size
    LOCSIG           : 0x04034b50, // "PK\003\004"
    LOCVER           : 4,	// version needed to extract
    LOCFLG           : 6, // general purpose bit flag
    LOCHOW           : 8, // compression method
    LOCTIM           : 10, // modification time (2 bytes time, 2 bytes date)
    LOCCRC           : 14, // uncompressed file crc-32 value
    LOCSIZ           : 18, // compressed size
    LOCLEN           : 22, // uncompressed size
    LOCNAM           : 26, // filename length
    LOCEXT           : 28, // extra field length

    /* The Data descriptor */
    EXTSIG           : 0x08074b50, // "PK\007\008"
    EXTHDR           : 16, // EXT header size
    EXTCRC           : 4, // uncompressed file crc-32 value
    EXTSIZ           : 8, // compressed size
    EXTLEN           : 12, // uncompressed size

    /* The central directory file header */
    CENHDR           : 46, // CEN header size
    CENSIG           : 0x02014b50, // "PK\001\002"
    CENVEM           : 4, // version made by
    CENVER           : 6, // version needed to extract
    CENFLG           : 8, // encrypt, decrypt flags
    CENHOW           : 10, // compression method
    CENTIM           : 12, // modification time (2 bytes time, 2 bytes date)
    CENCRC           : 16, // uncompressed file crc-32 value
    CENSIZ           : 20, // compressed size
    CENLEN           : 24, // uncompressed size
    CENNAM           : 28, // filename length
    CENEXT           : 30, // extra field length
    CENCOM           : 32, // file comment length
    CENDSK           : 34, // volume number start
    CENATT           : 36, // internal file attributes
    CENATX           : 38, // external file attributes (host system dependent)
    CENOFF           : 42, // LOC header offset

    /* The entries in the end of central directory */
    ENDHDR           : 22, // END header size
    ENDSIG           : 0x06054b50, // "PK\005\006"
    ENDSUB           : 8, // number of entries on this disk
    ENDTOT           : 10, // total number of entries
    ENDSIZ           : 12, // central directory size in bytes
    ENDOFF           : 16, // offset of first CEN header
    ENDCOM           : 20, // zip file comment length

    /* Compression methods */
    STORED           : 0, // no compression
    SHRUNK           : 1, // shrunk
    REDUCED1         : 2, // reduced with compression factor 1
    REDUCED2         : 3, // reduced with compression factor 2
    REDUCED3         : 4, // reduced with compression factor 3
    REDUCED4         : 5, // reduced with compression factor 4
    IMPLODED         : 6, // imploded
    // 7 reserved
    DEFLATED         : 8, // deflated
    ENHANCED_DEFLATED: 9, // enhanced deflated
    PKWARE           : 10,// PKWare DCL imploded
    // 11 reserved
    BZIP2            : 12, //  compressed using BZIP2
    // 13 reserved
    LZMA             : 14, // LZMA
    // 15-17 reserved
    IBM_TERSE        : 18, // compressed using IBM TERSE
    IBM_LZ77         : 19, //IBM LZ77 z

    /* General purpose bit flag */
    FLG_ENC          : 0,  // encripted file
    FLG_COMP1        : 1,  // compression option
    FLG_COMP2        : 2,  // compression option
    FLG_DESC         : 4,  // data descriptor
    FLG_ENH          : 8,  // enhanced deflation
    FLG_STR          : 16, // strong encryption
    FLG_LNG          : 1024, // language encoding
    FLG_MSK          : 4096, // mask header values

    /* Load type */
    FILE             : 0,
    BUFFER           : 1,
    NONE             : 2
};

_.isZip = function(inBuffer){
    var i = inBuffer.length - Constants.ENDHDR, // END header size
        n = Math.max(0, i - 0xFFFF), // 0xFFFF is the max zip file comment length
        endOffset = 0; // Start offset of the END header

    for (i; i >= n; i--) {
        if (inBuffer[i] != 0x50) continue; // quick check that the byte is 'P'
        if (inBuffer.readUInt32LE(i) == Constants.ENDSIG) { // "PK\005\006"
            endOffset = i;
            break;
        }
    }
    if (!endOffset){
       return false;
    }
    return true;
}


