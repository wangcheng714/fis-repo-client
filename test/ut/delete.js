var fis =  require('fis-cloud-kernel');
var expect = require('chai').expect;

describe('delete', function(){
	it('user', function(done){

		fis.db.remove("user", "tian", {name : "tian"}, {}, function(err, result){
			expect(result).to.equal(1);
			 fis.db.findOne("user", "tian", {name : "tian"}, function(err){
		        expect(err).to.equal("no user");
		                
			    fis.db.remove("user", "tian1", {name : "tian1"}, {}, function(){
			        fis.db.remove("user", "t", {name : "t"}, {}, function(){
			        	fis.db.remove("user", "tmp", {name : "tmp"}, {}, function(){
			        		// fis.db.remove("user", "tan", {name : "tan"}, {}, function(){
			        			done();
			        		// });
			        	});
			        });
			    });

		    });
		});

	});

});