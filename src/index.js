'use strict';

import { Config } from './util/config';
import endpoints from './routes/all-api';

var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');

var app = express();
app.set('port', Config.port || 9999);
app.use(bodyParser.json());
app.use(compress());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,' + Object.keys(req.headers).join());
    
	if (req.method === 'OPTIONS') {
		res.write(':)');
		res.end();
	} else next();
});

endpoints(app);

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});
