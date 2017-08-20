'use strict';

const mongoose = require('mongoose');

export class SessionID extends mongoose.Schema {
	
	constructor() {
		super({
			account_number: String,
			session_id: String
		});
	}	
}