var fis =  require("../../../fis-cloud-kernel/fis-cloud-kernel.js");
fis.db.remove("user", "tian", {name : "tian"}, {}, function(err, result){
    fis.db.remove("user", "tian1", {name : "tian1"}, {}, function(err, result){
        fis.db.remove("user", "t", {name : "t"}, {}, function(err, result){

        });
    });
});