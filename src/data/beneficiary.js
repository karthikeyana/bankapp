'use strict';

const mongoose = require('mongoose');

export class Beneficiary extends mongoose.Schema {
	
	constructor() {
		super({
			account_number: Number,
			account_name: String,
			ifsc_code: String
		});
	}
	
}