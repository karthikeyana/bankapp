'use strict';

import { Config } from '../util/config';
import { Account } from './account';
import { SessionID } from './session';
import { Beneficiary } from './beneficiary';
import { 
	ACCOUNT_MODEL,
	BENEFICIARY_MODEL,
	SESSION_MODEL
} from './model-constants';

const mongoose = require('mongoose');

export class ModelManager {

	constructor() {
		this.models = {};
		mongoose.Promise = global.Promise;
		mongoose.connect(Config.mongoURL);
		this.db = mongoose.connection;
		this.db.on('error', console.error.bind(console, 'connection error:'));
		this.initModels();
	}

	initModels() {
		this.addModel(ACCOUNT_MODEL, Account);
		this.addModel(BENEFICIARY_MODEL, Beneficiary);
		this.addModel(SESSION_MODEL, SessionID);
	}

	addModel(name, schemaClass) {
		this.models[name] = mongoose.model(name, new schemaClass(this));
	}

	getModel(name) {
		return this.models[name];
	}
	
}

export const modelManager = new ModelManager();
