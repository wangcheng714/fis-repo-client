var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var expect = require('chai').expect;
// var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");
var fs = require('fs');

describe('search', function(){
    var dir1 = __dirname+'/publish/4';              //smart-cov-0.0.1
    var dir2 = __dirname+'/publish/6';              //smart-cov-0.0.2
    var dir3 = __dirname+'/publish/cov-0.0.1';      //cov-0.0.1
    var result1 = fs.readFileSync(dir1+'/package.json','utf-8');
    var result2 = fs.readFileSync(dir2+'/package.json','utf-8');
    var result3 = fs.readFileSync(dir3+'/package.json','utf-8');
    before(function(done){
        client.adduser('tian','tian','tian@baidu.com',function(){
            // client.unpublish({name : "smart-cov",version:"all"}, {}, function(){
                    // client.publish(dir2, {}, function(){
                        client.publish(dir3, {}, function(){
                            done();
                        });
                    // });
            // });
            
        });
    });
    after(function(done){
        client.unpublish({name : "smart-cov",version:"all"}, {}, function(){
            client.unpublish({name : "cov",version:"all"}, {}, function(){
                done();
            });
        });
    });
    it('search name',function(done){
        //同一个包只能搜到最新版本包的信息
        client.search("smart-cov",function(err,msg){
            expect(msg).to.contain(JSON.parse(result2).version);
            expect(msg).to.contain(JSON.parse(result2).name);
            expect(msg).to.contain(JSON.parse(result2).author.name);
            expect(msg).to.contain(JSON.parse(result2).repository.url);

            client.search("cov",function(err,msg){
                expect(msg).to.contain(JSON.parse(result2).version);
                expect(msg).to.contain(JSON.parse(result2).name);
                expect(msg).to.contain(JSON.parse(result2).author.name);
                expect(msg).to.contain(JSON.parse(result2).repository.url);
                expect(msg).to.contain(JSON.parse(result3).version);
                expect(msg).to.contain(JSON.parse(result3).name);
                expect(msg).to.contain(JSON.parse(result3).author.name);
                expect(msg).to.contain(JSON.parse(result3).repository.url);

                    client.search("Smart-cov",function(err,msg){
                        expect(msg).to.contain(JSON.parse(result2).version);
                        expect(msg).to.contain(JSON.parse(result2).name);
                        expect(msg).to.contain(JSON.parse(result2).author.name);
                        expect(msg).to.contain(JSON.parse(result2).repository.url);

                        done();
                    });
            });
        });

    });

    it('search description',function(done){
        client.search("that computes statement",function(err,msg){
            expect(msg).to.contain(JSON.parse(result2).version);
            expect(msg).to.contain(JSON.parse(result2).name);
            expect(msg).to.contain(JSON.parse(result2).author.name);
            expect(msg).to.contain(JSON.parse(result2).repository.url);

            done();
        });

    });

    it('search keywords',function(done){
        client.search("function and branch coverage",function(err,msg){
            expect(msg).to.contain(JSON.parse(result2).version);
            expect(msg).to.contain(JSON.parse(result2).name);
            expect(msg).to.contain(JSON.parse(result2).author.name);
            expect(msg).to.contain(JSON.parse(result2).repository.url);

            client.search("JS code",function(err,msg){
                expect(msg).to.contain(JSON.parse(result2).version);
                expect(msg).to.contain(JSON.parse(result2).name);
                expect(msg).to.contain(JSON.parse(result2).author.name);
                expect(msg).to.contain(JSON.parse(result2).repository.url);
                expect(msg).to.contain(JSON.parse(result3).version);
                expect(msg).to.contain(JSON.parse(result3).name);
                expect(msg).to.contain(JSON.parse(result3).author.name);
                expect(msg).to.contain(JSON.parse(result3).repository.url);

                done();
            });
        });

    });

    it('search repository',function(done){
        //author 1 and 3 have tanwenmin, repository all have tanwenmin
        client.search("tanwenmin",function(err,msg){
            expect(msg).to.contain(JSON.parse(result3).version);
            expect(msg).to.contain(JSON.parse(result3).name);
            expect(msg).to.contain(JSON.parse(result3).author.name);
            expect(msg).to.contain(JSON.parse(result3).repository.url);

            client.search("/tanwenmin",function(err,msg){
                expect(msg).to.contain(JSON.parse(result3).version);
                expect(msg).to.contain(JSON.parse(result3).name);
                expect(msg).to.contain(JSON.parse(result3).author.name);
                expect(msg).to.contain(JSON.parse(result3).repository.url);

                client.search("git://github.com/",function(err,msg){
                    expect(msg).to.contain(JSON.parse(result2).version);
                    expect(msg).to.contain(JSON.parse(result2).name);
                    expect(msg).to.contain(JSON.parse(result2).author.name);
                    expect(msg).to.contain(JSON.parse(result2).repository.url);
                    expect(msg).to.contain(JSON.parse(result3).version);
                    expect(msg).to.contain(JSON.parse(result3).name);
                    expect(msg).to.contain(JSON.parse(result3).author.name);
                    expect(msg).to.contain(JSON.parse(result3).repository.url);

                    client.search("://github.",function(err,msg){
                        expect(msg).to.contain(JSON.parse(result2).version);
                        expect(msg).to.contain(JSON.parse(result2).name);
                        expect(msg).to.contain(JSON.parse(result2).author.name);
                        expect(msg).to.contain(JSON.parse(result2).repository.url);
                        expect(msg).to.contain(JSON.parse(result3).version);
                        expect(msg).to.contain(JSON.parse(result3).name);
                        expect(msg).to.contain(JSON.parse(result3).author.name);
                        expect(msg).to.contain(JSON.parse(result3).repository.url);

                        client.search("//github",function(err,msg){
                            expect(msg).to.contain(JSON.parse(result2).version);
                            expect(msg).to.contain(JSON.parse(result2).name);
                            expect(msg).to.contain(JSON.parse(result2).author.name);
                            expect(msg).to.contain(JSON.parse(result2).repository.url);
                            expect(msg).to.contain(JSON.parse(result3).version);
                            expect(msg).to.contain(JSON.parse(result3).name);
                            expect(msg).to.contain(JSON.parse(result3).author.name);
                            expect(msg).to.contain(JSON.parse(result3).repository.url);

                            done();
                        });
                    });

                });

            });
        });

    });

    it('query null',function(done){
        client.search(null,function(err,msg){
            expect(msg).to.deep.equal("[]");

            done();
        });
    });
    it('query undefined',function(done){

        client.search(undefined,function(err,msg){
            expect(msg).to.deep.equal("[]");

            client.search("hello",function(err,msg){
                expect(msg).to.deep.equal("[]");

                done();
            });
        });
    });

    //accept one parameter only
    it('array query',function(done){

        client.search(["code"],function(err,msg){
            expect(msg).to.contain(JSON.parse(result2).version);
            expect(msg).to.contain(JSON.parse(result2).name);
            expect(msg).to.contain(JSON.parse(result2).author.name);
            expect(msg).to.contain(JSON.parse(result2).repository.url);
            expect(msg).to.contain(JSON.parse(result3).version);
            expect(msg).to.contain(JSON.parse(result3).name);
            expect(msg).to.contain(JSON.parse(result3).author.name);
            expect(msg).to.contain(JSON.parse(result3).repository.url);

            done();
        });
    });

//    it('/term',function(done){
//
//        client.search({name:"smart-cov",version:"0.0.1"},function(err,msg){
//            console.log(err)
//            console.log(msg)
//            expect(msg).to.deep.equal("");
//
//            done();
//        });
//    });

});