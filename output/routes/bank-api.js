'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BankApi = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _controller = require('../util/controller');

var _modelManager = require('../data/model-manager');

var _modelConstants = require('../data/model-constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uuid = require('node-uuid');

var BankApi = exports.BankApi = function (_Controller) {
	_inherits(BankApi, _Controller);

	function BankApi() {
		_classCallCheck(this, BankApi);

		return _possibleConstructorReturn(this, (BankApi.__proto__ || Object.getPrototypeOf(BankApi)).apply(this, arguments));
	}

	_createClass(BankApi, [{
		key: 'namespace',
		value: function namespace() {
			return '/bank';
		}
	}, {
		key: 'routing',
		value: function routing() {
			return {
				'/create-bank-account': 'createBankAccount',
				'/login': 'login',
				'/balance-info': 'getBalance',
				'/add-beneficiary': 'addBeneficiary',
				'/transaction': 'transactionProcess',
				'/statement': 'getStatement'
			};
		}
	}, {
		key: 'login',
		value: function login(req, res) {
			var _this2 = this;

			var args = req.body;
			return this.AccountModel.findOne(args).exec().then(function (account) {
				return _this2.saveSession(account.account_number).then(function (data) {
					return {
						message: 'user login successfully',
						result: {
							account_number: account.account_number,
							session_id: data.sid
						}
					};
				});
			});
		}
	}, {
		key: 'createBankAccount',
		value: function createBankAccount(req, res) {
			var args = req.body;
			return new this.AccountModel(args).save().then(function (data) {
				return {
					message: 'account created successfully'
				};
			});
		}
	}, {
		key: 'saveSession',
		value: function saveSession(accdata) {
			var _this3 = this;

			var suuid = uuid.v4();
			return this.SessionModel.findOne({ account_number: accdata }).exec().then(function (data) {
				if (data !== null) {
					return _this3.SessionModel.findOneAndUpdate({ account_number: data.account_number }, { $set: { session_id: suuid } }, { 'new': true }).exec().then(function (data) {
						return {
							sid: data.session_id
						};
					});
				} else {
					return new _this3.SessionModel({
						account_number: accdata,
						session_id: suuid
					}).save().then(function (data) {
						return {
							sid: data.session_id
						};
					});
				}
			});
		}
	}, {
		key: 'getBalance',
		value: function getBalance(req, res) {
			var args = req.body;

			return this.AccountModel.findOne({ account_number: args.account_num }).then(function (data) {
				return {
					result: {
						account_number: data.account_number,
						balance: data.balance,
						currency: data.currency
					}
				};
			});
		}
	}, {
		key: 'addBeneficiary',
		value: function addBeneficiary(req, res) {
			var _this4 = this;

			var args = req.body;

			return this.AccountModel.findOne({ account_number: args.account_num }, { beneficiaries: { $elemMatch: { account_number: args.beneficiary.account_number } } }).exec().then(function (data) {

				if (data.beneficiaries.length == 0) {

					return new _this4.BeneficiaryModel(args.beneficiary).save().then(function (benefData) {

						return _this4.AccountModel.findOne({ account_number: args.account_num }).exec().then(function (accData) {

							var pushdata = {
								account_number: benefData.account_number,
								account_name: benefData.account_name
							};

							accData.beneficiaries.push(pushdata);

							return accData.save().then(function (data) {
								var bid = data.beneficiaries[data.beneficiaries.length - 1];
								if (bid.account_name == args.beneficiary.account_name) {
									return {
										message: "beneficiary added successfully",
										result: {
											account_number: bid.account_number,
											account_name: bid.dashboard_id,
											beneficiaries: data.beneficiaries
										}
									};
								} else {
									return {
										status: 'ERROR',
										message: "beneficiary adding process failed"
									};
								}
							});
						});
					});
				} else {
					return {
						status: 'ERROR',
						message: "beneficiary already added"
					};
				}
			});
		}
	}, {
		key: 'transactionProcess',
		value: function transactionProcess(req, res) {
			var _this5 = this;

			var args = req.body;

			return this.AccountModel.findOne({ account_number: args.account_num }).exec().then(function (data) {
				var from_account = {
					tran_date: args.beneficiary.date,
					particulars: args.beneficiary.account_number + '/' + args.beneficiary.account_name,
					debit: args.beneficiary.amount || '',
					credit: '',
					balance: data.balance - args.beneficiary.amount
				},
				    from_statement = data.transaction;
				from_statement.push(from_account);

				return _this5.AccountModel.findOneAndUpdate({ account_number: args.account_num }, { $set: { balance: data.balance - args.beneficiary.amount, transaction: from_statement } }, { 'new': true }).exec().then(function (trandata) {
					return _this5.AccountModel.findOne({ account_number: args.beneficiary.account_number }).exec().then(function (todata) {
						var to_account = {
							tran_date: args.beneficiary.date,
							particulars: trandata.account_number + '/' + trandata.account_name,
							debit: '',
							credit: args.beneficiary.amount || '',
							balance: todata.balance + args.beneficiary.amount
						},
						    to_statement = todata.transaction;
						to_statement.push(to_account);

						return _this5.AccountModel.findOneAndUpdate({ account_number: args.beneficiary.account_number }, { $set: { balance: todata.balance + args.beneficiary.amount, transaction: to_statement } }, { 'new': true }).exec().then(function (transaction) {
							return {
								message: "transaction successfull"
							};
						});
					});
				});
			});
		}
	}, {
		key: 'getStatement',
		value: function getStatement(req, res) {
			var args = req.body;
			return this.AccountModel.findOne({ "account_number": args.account_num, "transaction.tran_date": { $gte: new Date(args.from), $lte: new Date(args.to) } }).exec().then(function (data) {
				return {
					result: data.transaction
				};
			});
		}
	}, {
		key: 'AccountModel',
		get: function get() {
			return _modelManager.modelManager.getModel(_modelConstants.ACCOUNT_MODEL);
		}
	}, {
		key: 'SessionModel',
		get: function get() {
			return _modelManager.modelManager.getModel(_modelConstants.SESSION_MODEL);
		}
	}, {
		key: 'BeneficiaryModel',
		get: function get() {
			return _modelManager.modelManager.getModel(_modelConstants.BENEFICIARY_MODEL);
		}
	}]);

	return BankApi;
}(_controller.Controller);