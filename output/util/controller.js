'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Controller = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modelManager = require('../data/model-manager');

var _modelConstants = require('../data/model-constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = exports.Controller = function () {
	function Controller(app) {
		var _this = this;

		_classCallCheck(this, Controller);

		var routing = this.routing();

		this.sessionModel = _modelManager.modelManager.getModel(_modelConstants.SESSION_MODEL);

		var _loop = function _loop() {
			var method = routing[r];

			app.get(_this.namespace() + r, function (req, res) {

				if (!req.body.hasOwnProperty('sid')) {
					_this.callRoute(method, req, res);
				} else {
					return _this.getSession(req.body.sid, req.body.account_num).then(function (data) {
						if (data !== null) {
							_this.callRoute(method, req, res);
						} else {
							var info = {
								success: false,
								message: 'session experied!, please login and continue.',
								data: null
							};
							res.setHeader('Content-Type', 'application/json');
							res.write(JSON.stringify(info));
							res.end();
						}
					});
				}
			});

			app.post(_this.namespace() + r, function (req, res) {
				if (!req.body.hasOwnProperty('sid')) {
					_this.callRoute(method, req, res);
				} else {
					return _this.getSession(req.body.sid, req.body.account_num).then(function (data) {
						if (data !== null) {
							_this.callRoute(method, req, res);
						} else {
							var info = {
								success: false,
								message: 'session experied!, please login and continue.',
								data: null
							};
							res.setHeader('Content-Type', 'application/json');
							res.write(JSON.stringify(info));
							res.end();
						}
					});
				}
			});
		};

		for (var r in routing) {
			_loop();
		}
	}

	_createClass(Controller, [{
		key: 'namespace',
		value: function namespace() {
			return '';
		}
	}, {
		key: 'getSession',
		value: function getSession(sid, account_num) {
			return this.sessionModel.findOne({ session_id: sid, account_number: account_num }).exec();
		}
	}, {
		key: 'callRoute',
		value: function callRoute(method, req, res) {
			var _this2 = this;

			var result;
			try {
				result = this[method](req, res);
			} catch (e) {
				console.error(e.message + '\n' + e.stack);
				this.applyResult(req, res, this.error(e));
				return;
			}

			if (result && typeof result.then == 'function') {
				result.then(function (data) {
					return _this2.applyResult(req, res, data);
				}).catch(function (e) {
					console.error(typeof e == 'string' ? e : e.message + '\n' + e.stack);
					_this2.applyResult(req, res, _this2.error(e));
				});
				return;
			}

			this.applyResult(req, res, result);
		}
	}, {
		key: 'applyResult',
		value: function applyResult(req, res, result) {
			var output;
			if (!result) {
				output = {
					success: false,
					message: 'Empty result',
					details: result,
					data: null
				};
			} else if (result.status == 'ERROR') {
				output = {
					success: false,
					message: result.message,
					details: result,
					data: null
				};
			} else {
				output = {
					success: true,
					message: result.message,
					data: result.result
				};
			}

			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(output));
			res.end();
		}
	}, {
		key: 'error',
		value: function error(message) {
			if (typeof message == 'string') {
				return {
					status: 'ERROR',
					message: message
				};
			}
			if (message.message && typeof message.stack == 'string') {
				return {
					status: 'ERROR',
					result: {
						message: message.message,
						stack: message.stack.split('\n')
					}
				};
			}

			message.status = 'ERROR';
			return message;
		}
	}]);

	return Controller;
}();