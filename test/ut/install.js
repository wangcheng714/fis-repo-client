var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");
var rmTree = require("../util/removeDir.js").rmTree;
var fs = require('fs');

describe("install", function(){
    it("not exist pkg", function(done){
        var dir = './install/1',
            pkg = {
                name : "atest",
                version: "latest"
            };

        client.install(dir, pkg, null, function(error, message){
            expect(error.toString()).to.equal("Component [atest] not found!");
            done();
        });
    });

    it("not exist version", function(done){
        var dir = './install/1',
            pkg = {
                name : "smart-cov",
                version: "0.0.10"
            };

        client.install(dir, pkg, null, function(error, message){
            console.log(error);
            expect(error.toString()).to.equal("Component [smart-cov@0.0.10] not found!");
            done();
        });
    });

    it("special version", function(done){
        var dir = './install/2',
            pkg = {
                name : "smart-cov",
                version: "0.0.1"
            };
        rmTree(dir + "/smart-cov", function(){
            client.install(dir, pkg, null, function(error, message){
                expect(message).to.equal("Component [smart-cov@0.0.1] Install Success.");
                var file = fs.readFileSync(dir + "/smart-cov/package.json", "utf8");
                expect(JSON.parse(file).version).to.equal("0.0.1");
                done();
            });
        });
    });

    it("scaffold", function(done){
        var dir = './install/3',
            pkg = {
                name : "smart-cov",
                version: "0.0.3"
            };
        client.unpublish(pkg, {}, function(error, message){
            client.publish("./publish/7", {}, function(error, message){
                expect(message).to.equal("\"Publish component [smart-cov@0.0.3] success!\"");
                rmTree(dir + "/smart-cov", function(){
                    client.install(dir, pkg, null, function(error, message){
                        expect(message).to.equal("Component [smart-cov@0.0.3] Install Success.");
                        var file = fs.readFileSync(dir + "/smart-cov/package.json", "utf8");
                        expect(JSON.parse(file).version).to.equal("0.0.3");
                        done();
                    });
                });
            });
        });
    });
});