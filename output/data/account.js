'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mongoose = require('mongoose');

var Account = exports.Account = function (_mongoose$Schema) {
	_inherits(Account, _mongoose$Schema);

	function Account(manager) {
		_classCallCheck(this, Account);

		var trans = {
			tran_date: Date,
			particulars: String,
			debit: Number,
			credit: Number,
			balance: Number
		};

		var _this = _possibleConstructorReturn(this, (Account.__proto__ || Object.getPrototypeOf(Account)).call(this, {
			account_number: Number,
			account_name: String,
			ifsc_code: String,
			password: String,
			currency: String,
			balance: Number,
			beneficiaries: Array,
			transaction: [trans]
		}));

		_this.pre('remove', function (next) {
			manager.getModel(BENEFICIARY_MODEL).remove({ _id: { $in: this.beneficiaries } }).exec();
			next();
		});
		return _this;
	}

	return Account;
}(mongoose.Schema);