'use strict';

const mongoose = require('mongoose');

export class Account extends mongoose.Schema {
	
	constructor(manager) {

		var trans = {
				tran_date: Date,
				particulars: String,
				debit: Number,
				credit: Number,
				balance: Number
			}
		
		super({
			account_number: Number,
			account_name: String,
			ifsc_code: String,
			password: String,
			currency: String,
			balance: Number,
			beneficiaries: Array,
			transaction: [trans]
		});

		this.pre('remove', function(next) {
			manager
				.getModel(BENEFICIARY_MODEL)
				.remove({ _id: { $in: this.beneficiaries } })
				.exec();
			next();
		});
	}
	
}
