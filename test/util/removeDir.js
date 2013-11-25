var p = require('path'),
    fs = require('fs');
//�첽ɾ���ļ���
var rmTree = exports.rmTree = function(path, callback) {
    fs.exists(path, function(exists) {
        //����ļ�·�������ڻ��ļ�·�������ļ�����ֱ�ӷ���
        if (!exists || !fs.statSync(path).isDirectory()) return callback();
        fs.readdir(path, function(err, files) {
            if (err) return callback(err);
            //�����ļ����µ�ÿ���ļ�����ȫ·������һ������
            var fullNames = files.map(function(file) { return p.join(path, file); });
            //��ȡ�ļ����µ��ļ�������
            getFilesStats(fullNames, fs.stat, function(err, stats) {
                var files = [];
                var dirs = [];
                //��Ҫʹ�� for in ������������п�ֵ���᲻һһ��Ӧ
                for (var i = 0; i < fullNames.length; i++) {
                    if (stats[i].isDirectory()) {
                        dirs.push(fullNames[i]);
                    } else {
                        files.push(fullNames[i]);
                    }
                }
                //��ɾ�ļ�����ɾ�ļ���
                serial(files, fs.unlink, function(err) {
                    if (err) return callback(err);
                    serial(dirs, rmTree, function(err) {
                        if (err) return callback(err);
                        //���ɾ�����ļ���
                        fs.rmdir(path, callback);
                    });
                });
            });
        });
    });
};
//��ȡ�ļ�������
var getFilesStats = function(list, stat, callback) {
    if (!list.length) return callback(null, []);
    //concat ���޲������൱�ڿ���һ�����飬��������������
    var copy = list.concat();
    var statArray = [];
    //handle �������ˡ������д�Ļ����һ�� handler ����д��ȥ�������Ļ������ô�һ�� copy �������鷳
    stat(copy.shift(), function handler(err, stats) {
        statArray.push(stats);
        if (copy.length) {
            stat(copy.shift(), handler);
        } else {
            callback(null, statArray);
        }
    });
};
//ɾ���ļ�
var serial = function(list, rmfile, callback) {
    if (!list.length) return callback(null, []);
    var copy = list.concat();
    rmfile(copy.shift(), function handler(err) {
        if (err) return callback(err);
        if (copy.length) {
            rmfile(copy.shift(), handler);
        } else {
            callback(null);
        }
    });
};