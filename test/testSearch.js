var search = require('../lib/search.js');

var query = 'fis';
search(query, function(error, body){
        if (error) {
           console.log(error);
        }else{
            console.log(body);
        }
});