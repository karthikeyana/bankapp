'use strict';

var _config = require('./util/config');

var _allApi = require('./routes/all-api');

var _allApi2 = _interopRequireDefault(_allApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');

var app = express();
app.set('port', _config.Config.port || 9999);
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

(0, _allApi2.default)(app);

var server = app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + server.address().port);
});