var expect = require('chai').expect;
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    repos = domain + ":" + port,
    client = new RepoClient(repos);
var fis =  require('fis-cloud-kernel');

describe('basic', function(){
    it('first time - tian', function(done){
        fis.db.remove("user", "tian", {name : "tian"}, {}, function(err, result){
            client.adduser('tian', 'tian', 'tian@baidu.com', function(error, message){
                expect(message).to.equal("Adduser success!");
                fis.db.findOne("user", "tian", {name : "tian"}, function(err, result){
                    expect(result.email).to.equal("tian@baidu.com");
                    done();
                });
            });
        });
    });

    it('first time - t', function(done){
        fis.db.remove("user", "t", {name : "t"}, {}, function(err, result){
            client.adduser('t', 't', 't@baidu.com', function(error, message){
                expect(message).to.equal("Adduser success!");
                fis.db.findOne("user", "t", {name : "t"}, function(err, result){
                    expect(result.email).to.equal("t@baidu.com");
                    done();
                });
            });
        });
    });

    it('first time - wrong email', function(done){
        fis.db.remove("user", "tian", {name : "tian"}, {}, function(err, result){
            client.adduser('tian', 'tian', 'tian', function(error){
                expect(error).to.be.equal("invalid format of email");
                fis.db.findOne("user", "tian", {name : "tian"}, function(err, result){
                    expect([undefined, null]).to.contain(result);
                    done();
                });
            });
        });
    });

    it('first time - duplicate email', function(done){
        client.adduser('tian', 'tian', 'tian@baidu.com', function(error){
            fis.db.remove("user", "tian1", {name : "tian1"}, {}, function(err, result){
                client.adduser('tian1', 'tian1', 'tian@baidu.com', function(error, message){
                    expect(message).to.equal("Adduser success!");
                    fis.db.findOne("user", "tian1", {name : "tian1"}, function(err, result){
                        expect(result.email).to.equal("tian@baidu.com");
                        done();
                    });
                });
            });
        });
    })

    it('second time', function(done){
        client.adduser('tian', 'tian', 'tian@baidu.com', function(error, message){
            expect(message).to.be.equal("Adduser success!");
            done();
        });
    })

    it('second time - wrong password', function(done){
        client.adduser('tian', '1', 'tian@baidu.com', function(error, message){
            expect(error).to.be.equal("\"sorry, username or password is wrong!\"");
            done();
        });
    })

    it('second time - update email', function(done){
        client.adduser('tian', 'tian', 't@baidu.com', function(error, message){
            expect(message).to.equal("Adduser success!");
            fis.db.findOne("user", "tian", {name : "tian"}, function(err, result){
                expect(result.email).to.equal("t@baidu.com");
                done();
            });
        });
    })
})