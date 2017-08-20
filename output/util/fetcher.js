'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require('node-fetch');

var Fetcher = exports.Fetcher = function () {
	function Fetcher() {
		_classCallCheck(this, Fetcher);
	}

	_createClass(Fetcher, null, [{
		key: 'paramsToQueryString',
		value: function paramsToQueryString(params) {
			if (!params) return '';
			var list = [];
			for (var i in params) {
				list.push(i + '=' + params[i]);
			}
			return list.join('&');
		}
	}, {
		key: 'getJson',
		value: function getJson(url, params, headers) {
			return fetch(url + this.paramsToQueryString(params), {
				headers: headers
			}).then(function (res) {
				return res.json();
			});
		}
	}, {
		key: 'postJson',
		value: function postJson(url, data, headers) {
			return this.post(url, JSON.stringify(data), headers);
		}
	}, {
		key: 'post',
		value: function post(url, payload, headers) {
			return fetch(url, {
				headers: Object.assign({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}, headers),
				method: 'POST',
				body: payload
			}).then(function (res) {
				return res.json();
			});
		}
	}]);

	return Fetcher;
}();