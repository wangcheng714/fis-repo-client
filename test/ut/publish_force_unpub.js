var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");

//-------接着publish.js这个例子------

describe("publish", function(){
 
    it("publish again - force", function(done){
        client.publish("./test/ut/publish/5", {force:true}, function(error, message){
            expect(message).to.equal("Publish component [smart-cov@0.0.1] success!");
            fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                expect(pkg.version).to.equal("0.0.1");
                expect(pkg.readme).to.equal("smart-cov-1");
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