var blink = require('./blink');
var express = require('express');
var app = express();

app.get('/toggleblink', function (req, res) {
	blink.toggle()
		.then((result) => res.send(result))
		.catch((error) => res.sent(error));
});

app.listen(3008);