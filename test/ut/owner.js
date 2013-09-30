
var RepoClient = require("../../fis-repo-client.js"),
    client = new RepoClient();
var expect = require('chai').expect;
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");

//entaining with ensurance that there is no users or pkgs

describe('add--', function(){
    var pkg1 = {
        name : "smart-cov",
        version : "0.0.1"
    };
    var pkg2 = {
        name : "smart-cov",
        version : "0.0.2"
    };
    before(function(done){
        //实现初始化数据库及用户
        fis.db.remove("user", "tan", {name : "tan"}, {}, function(){
            fis.db.remove("user", "lily", {name : "lily"}, {}, function(){
                done();
            });
        });

    });
//    afterEach(function(){
//        //实现初始化数据库及用户
//        fis.db.remove("user", "tan", {name : "tan"}, {}, function(){});
//        fis.db.remove("user", "lily", {name : "lily"}, {}, function(){});
//    });

    it('no adder',function(done){
        var options = {
            username : "tan"
        };

        client.owner('add', pkg1, options, function(error){
            expect(error).to.be.equal("User [tan] not exist, register first!");
            done();
        });

    });

    it('add owner to pkg not exist + ls non-exist pkg', function(done){
        var options = {
            username : "tan"
        };

        client.adduser('tan','tan','tan@baidu.com',function(){
            client.owner('add',pkg1,options, function(err){
                expect(err).to.be.equal("Component [smart-cov@0.0.1] not found!");

                client.owner('ls', pkg1, options, function(err){
                    expect(err).to.be.equal("Component [smart-cov]@0.0.1 not found!");
                    done();
                })

            });
        });
    });

    it('no added', function(done){
        var dir1 = __dirname+'/publish/4';
        var options = {
            username : "lily"
        };

        setTimeout(
            client.publish(dir1, {}, function(){

                client.owner('add',pkg1, options,function(error){
                    expect(error).to.be.equal("User [lily] not exist, register first!");

                    client.owner('ls',pkg1,{username:"tan"}, function(err, msg){
                        expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");

                        done();
                    });

                });

            })
            , 10000);

    });

    it('owner twice', function(done){
        var options = {
            username : "tan"
        };

        setTimeout(
            client.owner('add',pkg1, options,function(err,msg){
                expect(msg).to.be.equal("Add user [tan] success!");
                done();
            })
            , 10000);


    });

//    it('one owner all owner', function(done){
//        var dir2 = __dirname+'/publish/6';
//        setTimeout(
//            client.publish(dir2, {force:true}, function(){
//
//                client.owner('ls',pkg1,{username:"tan"}, function(err, msg){
//                    expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");
//
//                    client.owner('ls',pkg2,{username:"tan"}, function(err, msg){
//                        expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");
//                        done();
//                    });
//                });
//            })
//            , 10000);
//
//    });

    it('add owner + one owner all owner', function(done){
        var options = {
            username : "lily"
        };

        client.adduser('lily','lily','lily@baidu.com',function(){
            //更换权限用户
            client.adduser('tan','tan','tan@baidu.com',function(){
                client.owner('add',pkg1, options,function(error,msg){
                    expect(msg).to.be.equal("Add user [lily] success!");

                    client.owner('ls',pkg1,{username:"lily"}, function(err, msg){
                        expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\nusername : lily email : lily@baidu.com\n");

//                        client.owner('ls',pkg2,{username:"lily"}, function(err, msg){
//                            expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\nusername : lily email : lily@baidu.com\n");
                            done();
//                        });
                    });
                });
            });

        });

    });

});

describe('delete--', function(){
    var pkg1 = {
        name : "smart-cov",
        version : "0.0.1"
    };
    var pkg2 = {
        name : "smart-cov",
        version : "0.0.2"
    };
//    before(function(){
//        client.adduser('tan','tan','tan@baidu.com');
//    });
    after(function(done){
        client.unpublish(__dirname+'/publish/4', {}, function(){
//            client.unpublish(__dirname+'/publish/6', {}, function(){
                fis.db.remove("user", "tan", {name : "tan"}, {}, function(){
                    done();
                });
//            });
        });
    });

    it('general + ls change + one del all del',function(done){
        var options = {
            username : "lily"
        };

        client.owner('rm',pkg1,options, function(err, msg){
            expect(msg).to.be.equal("Remove user [lily] success!");

            client.owner('ls',pkg1,{username:"lily"}, function(err, msg){
                expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");

//                client.owner('ls',pkg2,{username:"lily"}, function(err, msg){
//                    expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");
                    done();
//                });
            });
        });
    });

    it('del twice',function(done){
        var options = {
            username : "lily"
        };

        client.owner('rm',pkg1,options, function(err){
            expect(err).to.be.equal("Owner rm error User [lily] is not maintainer");

            done();
        });
    });

    it('no deleted',function(done){
        var options = {
            username : "lily"
        };

        fis.db.remove("user", "lily", {name : "lily"}, {}, function(){
            client.owner('rm',pkg1,options, function(err){
                expect(err).to.be.equal("User [lily] not exist, register first!");

                done();
            });
        });
    });

    it('deleter is not owner + lser is not owner',function(done){
        var options = {
            username : "tan"
        };

        client.adduser('tmp','tmp','tmp@baidu.com',function(){
            client.owner('rm',pkg1,options, function(err){
                expect(err).to.be.equal("No permission rm owner for component [smart-cov@0.0.1]");

                client.owner('ls',pkg1, options, function(err,msg){
                    expect(msg).to.be.equal("\nusername : tan email : tan@baidu.com\n");

                    done();
                });

            });

        });

    });

//    //BUG--add after bug fixed, otherwise will produce non-maintainer pkg
//    it('self del',function(done){
//        var options = {
//            username : "tan"
//        };
//
//        fis.db.remove("user", "tmp", {name : "tmp"}, {}, function(){
//            client.adduser('tan','tan','tan@baidu.com',function(){
//                client.owner('rm',pkg1,options, function(err){
//                    expect(err).to.be.equal("No permission rm owner for component [smart-cov@0.0.1]");
//
//                    done();
//                });
//            });
//        });
//    });

    it('del for pkg not exist + ls for nonexist version',function(done){
        var options = {
            username : "tan"
        };

        client.unpublish(pkg1, {}, function(){
            client.owner('rm',pkg1,options, function(err){
                expect(err).to.be.equal("Component [smart-cov@0.0.1] not found!");

//                client.unpublish(pkg2, {}, function(){

//                    client.owner('ls',pkg2,{}, function(err){
//                        expect(err).to.be.equal("error");

                        done();
//                    });
//                });
            });

        });

    });
});