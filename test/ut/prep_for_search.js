var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    client = new RepoClient(domain,port);
var expect = require('chai').expect;

var dir2 = __dirname+'/publish/6';              //smart-cov-0.0.2

describe('prepare for search',function(){
    it('publish', function(done){
        client.adduser('tan','tan','tan@baidu.com',function(){
            client.unpublish({name : "smart-cov",version:"all"}, {}, function(){
                        client.publish(dir2, {}, function(e,m){
                            expect(m).to.equal("Publish component [smart-cov@0.0.2] success!");
                            done();
                    });
            });
            
        });

    });
});