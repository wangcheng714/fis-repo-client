var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var rmTree = require("../util/removeDir.js").rmTree;
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");
var fs = require('fs');

//-------接着publish.js这个例子------

describe("publish", function(){
 
    it("publish again - force", function(done){
        client.adduser('tian', 'tian', 'tian@baidu.com', function(error, message){
            client.publish("./test/ut/publish/5", {force:true}, function(error, message){
                expect(message).to.equal("Publish component [smart-cov@0.0.1] success!");
                fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                    expect(pkg.version).to.equal("0.0.1");
                    expect(pkg.readme).to.equal("smart-cov-1");
                    done();
                });
            });
        });
        
    });

    it("ignore", function(done){

        var dir = './test/ut/install/2',
            pkg = {
                name : "smart-cov",
                version: "0.0.1"
            };
        rmTree(dir + "/smart-cov", function(){
            client.install(dir, pkg, null, function(error, message){
                expect(message).to.equal("Component [smart-cov@0.0.1] Install Success.");
                expect(fs.existsSync(dir+"/smart-cov")).to.be.true;
                expect(fs.existsSync(dir+"/smart-cov/a.js")).to.be.false;
                expect(fs.existsSync(dir+"/smart-cov/b.txt")).to.be.false;
                expect(fs.existsSync(dir+"/smart-cov/c.css")).to.be.false;
                expect(fs.existsSync(dir+"/smart-cov/mkg")).to.be.false;
                expect(fs.existsSync(dir+"/smart-cov/t.tpl")).to.be.false;
                done();
            });
        });
        
    });

//    it("publish again - different version", function(done){
//        client.publish("./publish/6", {}, function(error, message){
//            expect(message).to.equal("\"Publish component [smart-cov@0.0.2] success!\"");
//            fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
//                expect(pkg.version).to.equal("0.0.2");
//                expect(pkg.readme).to.equal("smart-cov-1");
//                done();
//            });
//        })
//    });
});


describe("unpublish", function(){
    it("unpublish - special version", function(done){
        var pkg = {
            name : "smart-cov",
            version : "0.0.1"
        };
        client.unpublish(pkg, {}, function(error, message){
            expect(message).to.equal("Unpublish component [smart-cov@0.0.1] success!");
            fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                expect(pkg).to.equal(null);
                done();
            });
        });
    })

    it("unpublish - not exist", function(done){
        var pkg = {
            name : "smart-cov",
            version : "0.0.1"
        };
        client.unpublish(pkg, {}, function(error, message){
            expect(error).to.equal("Unpublish component [smart-cov@0.0.1] not exist!");
            done();
        });
    })
});