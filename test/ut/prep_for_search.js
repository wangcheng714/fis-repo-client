var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    repos = domain + ":" + port;
    client = new RepoClient(repos);
var expect = require('chai').expect;
var fis =  require('fis-cloud-kernel');

var dir2 = __dirname+'/publish/6';              //smart-cov-0.0.2

describe('prepare for search',function(){
    it('publish', function(done){
        //发布smart-cov@0.0.2包，在search.js里与cov@0.0.1包进行search关键字搜索比较
        client.adduser('tian','tian','tian@baidu.com',function(){
            client.unpublish({name : "smart-cov",version:"all"}, {}, function(){
                        client.publish(dir2, {}, function(e,m){
                            expect(m).to.equal("Publish component [smart-cov@0.0.2] success!");
                            fis.db.findOne("pkgs", "tian", {name : "smart-cov"}, function(error, pkg){
                                expect(pkg.version).to.equal("0.0.2");
                                expect(pkg.latest).to.equal("0.0.2");
                                expect(pkg.versionHistory).to.contain("0.0.2");
                                done();
                            });
                    });
            });
            
        });

    });
});