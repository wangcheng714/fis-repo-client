var RepoClient = require("../../fis-repo-client.js"),
    client = new RepoClient();
var expect = require('chai').expect;
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");
var fs = require('fs');

describe('search', function(){
    var dir1 = __dirname+'/search/smart-cov-0.0.1';
    var dir2 = __dirname+'/search/smart-cov-0.0.2';
    var dir3 = __dirname+'/search/cov-0.0.1';
    var result1 = fs.readFileSync(dir1+'/expect.txt','utf-8');
    var result2 = fs.readFileSync(dir2+'/expect.txt','utf-8');
    var result3 = fs.readFileSync(dir3+'/expect.txt','utf-8');
    before(function(done){
        client.adduser('tan','tan','tan@baidu.com',function(){
            client.publish(dir1, {}, function(){
                client.publish(dir2, {}, function(){
                    client.publish(dir3, {}, function(){
                        done();
                    });
                });
            });
        });
    });
    after(function(done){
        client.unpublish(dir1, {}, function(){
            client.unpublish(dir2, {}, function(){
                client.unpublish(dir3, {}, function(){
                    fis.db.remove("user", "tan", {name : "tan"}, {}, function(){
                        done();
                    });
                });
            });
        });
    });
    it('search name',function(done){

//       client.publish(dir3, {}, function(){
           client.search("smart-cov",function(err,msg){
               expect(msg).to.deep.equal("[\n"+result2+"\n]");
               client.search("cov",function(err,msg){
                   expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

//                   client.unpublish(dir3, {}, function(){
                       client.search("Smart-cov",function(err,msg){
                           expect(msg).to.deep.equal("[]");

                           done();
                       });
//                   });
               });
             });

//        });

    });

    it('search maintainer',function(done){
        client.search("tan",function(err,msg){
            expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

            done();
        });
    });

    it('search description',function(done){
        client.search("that computes statement",function(err,msg){
            console.log(err)
            console.log(msg)
            expect(msg).to.deep.equal("[\n"+result2+"\n]");

            done();
        });

    });

    it('search keywords',function(done){
        client.search("code",function(err,msg){
            console.log(err)
            console.log(msg)
            expect(msg).to.deep.equal("[\n"+result3+"\n]");

            client.search("JS",function(err,msg){
                console.log(err)
                console.log(msg)
                expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

                done();
            });
        });

    });

    it('search repository',function(done){
        //author 1 and 3 have tanwenmin, repository all have tanwenmin
        client.search("tanwenmin",function(err,msg){
            expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

            client.search("/tanwenmin",function(err,msg){
                expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

                client.search("git://github.com/",function(err,msg){
                    expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

                    client.search("://github.",function(err,msg){
                        expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

                        client.search("//github",function(err,msg){
                            expect(msg).to.deep.equal("[\n"+result2+result3+"\n]");

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
            console.log(err)
            console.log(msg)
            expect(msg).to.deep.equal("[\n"+result3+"\n]");

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