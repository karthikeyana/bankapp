'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (app) {

	new _bankApi.BankApi(app);
};

var _bankApi = require('./bank-api');