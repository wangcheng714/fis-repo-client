var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");

describe("publish", function(){
    it("no package.json", function(done){
        client.adduser('tian', 'tian', 'tian@baidu.com', function(error, message){
            client.publish("./test/ut/publish/1", {}, function(error){
                expect(error).to.contain("Could not publish, missing file");
                done();
            })
        });
    });

//    it("package.json - no name", function(done){
//        client.publish("./publish/2", {}, function(error){
//            expect(error).to.contain("No permission publish component [undefined]");
//            done();
//        })
//    });
//
//    it("package.json - no version", function(done){
//        client.publish("./publish/3", {}, function(error){
//            expect(error).to.contain("No permission publish component [undefined]");
//            done();
//        })
//    });

    it("publish & unpublish - all versions", function(done){
        var pkg = {
            name : "smart-cov",
            version : "all"
        };
        setTimeout(function(){
                client.unpublish(pkg, {}, function(error, message){
                client.publish("./test/ut/publish/4", {}, function(error, message){console.log(error);console.log(message);
                    expect(message).to.equal("Publish component [smart-cov@0.0.1] success!");
                    fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                        expect(pkg.version).to.equal("0.0.1");
                        done();
                    });
                })
            });
            }, 1500);
        
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

    it("publish again - force", function(done){
        setTimeout(function(){
                client.publish("./test/ut/publish/5", {force:true}, function(error, message){
                expect(message).to.equal("Publish component [smart-cov@0.0.1] success!");
                fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                    expect(pkg.version).to.equal("0.0.1");
                    expect(pkg.readme).to.equal("smart-cov-1");
                    done();
                });
            })
        }, 1500);
        
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