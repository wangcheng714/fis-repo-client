var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    repos = domain + ":" + port,
    client = new RepoClient(repos);
// var fis =  require('fis-cloud-kernel');
var rmTree = require("../util/removeDir.js").rmTree;
var fs = require('fs');

describe("install", function(){
    before(function(done){
    //publish smart-cov@0.0.1
        client.publish("./test/ut/publish/4", {}, function(){
            done();
        })
    });

    after(function(done){
        var pkg = {
            name : "smart-cov",
            version : "0.0.1"
        };
        client.unpublish(pkg, {}, function(){
            done();
        });
    });

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
            expect(error.toString()).to.equal("Component [smart-cov@0.0.10] not found!");
            done();
        });
    });

    it("special version", function(done){
        var dir = './test/ut/install/2',
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

    it.skip("scaffold", function(done){
        var dir = './test/ut/install/3',
            pkg = {
                name : "smart-cov",
                version: "0.0.3"
            };
        client.unpublish(pkg, {}, function(error, message){
            client.publish("./test/ut/publish/7", {}, function(error, message){
                expect(message).to.equal("Publish component [smart-cov@0.0.3] success!");
                rmTree(dir + "/smart-cov", function(){
                    client.install(dir, pkg, {}, function(error, message){
                        expect(message).to.equal("Component [smart-cov@0.0.3] Install Success.");
                        var file = fs.readFileSync(dir + "/smart-cov/package.json", "utf8");
                        expect(JSON.parse(file).version).to.equal("0.0.3");

                        // //确认改名成功
                        // expect( fs.existsSync(dir + "/smart-cov/f.html") ).to.be.true;
                        // expect( fs.existsSync(dir + "/smart-cov/d") ).to.be.true;
                        // // //BUG unsolved
                        // // expect( fs.existsSync(dir + "/smart-cov/d/f") ).to.be.true;

                        // file = fs.readFileSync(dir + "/smart-cov/f.html", "utf8");
                        // expect(file).to.contain("hello");
                        // file = fs.readFileSync(dir + "/smart-cov/cli.js", "utf8");
                        // expect(file).to.equal("var a = v + a;");
                        // // //BUG unsolved
                        // // file = fs.readFileSync(dir + "/smart-cov/d/f", "utf8");
                        // // expect(file).to.contain("hello");

                        done();
                    });
                });
            });
        });
    });
});