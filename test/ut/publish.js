var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    repos = domain + ":" + port,
    client = new RepoClient(repos);
var fis =  require('fis-cloud-kernel');

describe("publish", function(){
    it("no package.json", function(done){
        client.adduser('tian', 'tian', 'tian@baidu.com', function(error, message){
            client.publish("./test/ut/publish/1", {}, function(error){
                expect(error).to.contain("Could not publish, missing file");
                done();
            })
        });
    });

   // it("package.json - no name", function(done){
   //     client.publish("./publish/2", {}, function(error){
   //         expect(error).to.contain("No permission publish component [undefined]");
   //         done();
   //     })
   // });

   // it("package.json - no version", function(done){
   //     client.publish("./publish/3", {}, function(error){
   //         expect(error).to.contain("No permission publish component [undefined]");
   //         done();
   //     })
   // });

    it("publish & unpublish - all versions", function(done){
        var pkg = {
            name : "smart-cov",
            version : "all"
        };
        client.unpublish(pkg, {}, function(error, message){
            client.publish("./test/ut/publish/4", {}, function(error, message){
                expect(message).to.equal("Publish component [smart-cov@0.0.1] success!");
                fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                    expect(pkg.version).to.equal("0.0.1");
                    expect(pkg.latest).to.equal("0.0.1");
                    expect(pkg.versionHistory).to.contain("0.0.1");
                    
                    done();
                });
            });
        });
        
    });

//    it("publish again", function(done){
//        client.publish("./publish/5", {}, function(error, message){
//            expect(error).to.equal("Component [smart-cov@0.0.1] already exist.");
//            fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
//                expect(pkg.version).to.equal("0.0.1");
//                expect(pkg.readme).to.equal("smart-cov");
//                done();
//            });
//        })
//    });

});
