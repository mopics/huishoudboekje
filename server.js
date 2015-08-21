var express = require('express');


var day = new Date().getUTCDate();
var mutations = [
	{ uid:0, name:"huur", 			amount:-389.11, monthday:2,  	monthly:1, due:0 },
	{ uid:1,name:"eneco_abbo",	amount:-11.08,  monthday:26, 	monthly:1, due:0  },
	{ uid:2,name:"huurtoeslag",	amount:148,  	monthday:20, 	monthly:1, due:0  },
	{ uid:3,name:"zorgtoeslag",	amount:78,  	monthday:20, 	monthly:1, due:0  },
	{ uid:4,name:"ohra ziekte",	amount:-110.14, monthday:9,  	monthly:1, due:0  },
	{ uid:5,name:"ohra schade",	amount:-20.64,  monthday:2, 	monthly:1, due:0  },
	{ uid:6,name:"rabo bankk.",	amount:-3,  	monthday:1, 	monthly:1, due:0  },
	{ uid:7,name:"electrabel",	amount:-74,  	monthday:21, 	monthly:1, due:0  },
	{ uid:8,name:"ASR",			amount:-11.34,  monthday:4, 	monthly:1, due:0  },
	{ uid:9,name:"greenpeace",	amount:-2.27,  	monthday:22, 	monthly:1, due:0  },
	{ uid:10,name:"bibliotheek",	amount:-2.58,  	monthday:0, 	monthly:12, due:0  },
	{ uid:11,name:"kpn tel.int.",	amount:-65,  	monthday:20, 	monthly:1, due:0  },
	{ uid:12,name:"t-mobile",		amount:-12,  	monthday:3, 	monthly:1, due:0  },
	{ uid:13,name:"eigen risico", 	amount:-25,		monthday:0,		monthly:12, due:0 }
];
// set due flags:
for( var i in mutations ){
	var item = mutations[i];
	item.due = day < item.monthday;

}

var app = express();

app.use("/", express.static(__dirname__));

app.get('/mutations', function(req, res) {
	res.send(mutations);
});
app.get('/mutation/:id', function(req, res) {
	res.send(mutations[req.params.id]);
});
app.get('/mutation_save/:id', function( req, res ){
	// get posted json

});

app.listen(3000);
console.log('Listening on port 3000');

