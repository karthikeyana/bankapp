'use strict';

import { Controller } from '../util/controller';
import { modelManager } from '../data/model-manager';
import { 
	ACCOUNT_MODEL,
	BENEFICIARY_MODEL,
	SESSION_MODEL
} from '../data/model-constants';

const uuid = require('node-uuid');

export class BankApi extends Controller {

	namespace() {
		return '/bank';
	}
	
	routing() {
		return {
			'/create-bank-account': 'createBankAccount',
			'/login': 'login',
			'/balance-info': 'getBalance',
			'/add-beneficiary': 'addBeneficiary',
			'/transaction': 'transactionProcess',
			'/statement': 'getStatement'
		};
	}

	get AccountModel() {
		return modelManager.getModel(ACCOUNT_MODEL);
	}

	get SessionModel() {
		return modelManager.getModel(SESSION_MODEL);
	}

	get BeneficiaryModel() {
		return modelManager.getModel(BENEFICIARY_MODEL);
	}

	login(req, res) {
		let args = req.body;
		return this.AccountModel
			.findOne(args)
			.exec()
			.then(account => {
			return	this.saveSession(account.account_number)
					.then(data => {
						return {
							message: 'user login successfully',
							result: {
								account_number: account.account_number,
								session_id: data.sid
							}
						}
					})
			})
	}

	createBankAccount(req, res) {
		let args = req.body;
		return new this.AccountModel(args)
			.save()
			.then(data =>{
				return {
				message: 'account created successfully'
			};
		});
	}

	saveSession(accdata) {

		var suuid = uuid.v4();
		return this.SessionModel
			.findOne({ account_number: accdata })
			.exec()
			.then(data=>{
				if (data !== null) {
					return this.SessionModel
					.findOneAndUpdate({ account_number : data.account_number }, { $set: { session_id: suuid } }, { 'new': true })
					.exec()
					.then(data=>{
						return {
							sid: data.session_id
						};
					});
				} else {
					return new this.SessionModel({
						account_number: accdata,
						session_id: suuid
					})
					.save()
					.then(data =>{
						return {
							sid: data.session_id
						};
					});
				}
		});
	}

	getBalance(req, res) {
		var args = req.body;

		return this.AccountModel
			.findOne({account_number: args.account_num})
			.then(data =>{
				return {
					result:{
						account_number: data.account_number,
						balance: data.balance,
						currency: data.currency
					}			
				}
		});
	}

	addBeneficiary(req,res) {
		var args = req.body;

		return this.AccountModel
				.findOne({account_number: args.account_num },{ beneficiaries: { $elemMatch : { account_number : args.beneficiary.account_number }}})
				.exec()
				.then(data => {

					if (data.beneficiaries.length == 0) {

						return new this.BeneficiaryModel(args.beneficiary)
							.save()
							.then(benefData => {
								
							return this.AccountModel
									.findOne({ account_number: args.account_num })
									.exec()
									.then(accData => {

										var pushdata = {
											account_number: benefData.account_number,
											account_name: benefData.account_name
										};

										accData.beneficiaries.push(pushdata);

									return	accData
											.save()
											.then(data => {
												var bid = data.beneficiaries[data.beneficiaries.length - 1];
												if(bid.account_name == args.beneficiary.account_name){
													return {
														message: "beneficiary added successfully",
														result: {
															account_number: bid.account_number,
															account_name: bid.dashboard_id, 
															beneficiaries:data.beneficiaries 
														}
													}
												}else{
													return {
														status: 'ERROR',
														message: "beneficiary adding process failed"
													}
												}
											})
									})
							})
					} else {
						return {
							status: 'ERROR',
							message: "beneficiary already added"
						}
					}	
			})
		}

	transactionProcess(req,res) {
		var args = req.body;

		return this.AccountModel
			.findOne({ account_number: args.account_num })
			.exec()
			.then(data => {
				var from_account = {
						tran_date: args.beneficiary.date,
						particulars: args.beneficiary.account_number + '/' + args.beneficiary.account_name,
						debit: args.beneficiary.amount || '',
						credit: '',
						balance: data.balance - args.beneficiary.amount
					},
					from_statement = data.transaction;
					from_statement.push(from_account)
					
				return this.AccountModel
					.findOneAndUpdate({account_number: args.account_num}, {$set: { balance: data.balance - args.beneficiary.amount, transaction: from_statement}}, {'new':true})
					.exec()
					.then(trandata =>{
						return this.AccountModel
							.findOne({ account_number: args.beneficiary.account_number })
							.exec()
							.then(todata => {
								var to_account = {
										tran_date: args.beneficiary.date,
										particulars: trandata.account_number + '/' + trandata.account_name,
										debit: '',
										credit: args.beneficiary.amount || '',
										balance: todata.balance + args.beneficiary.amount
									},
									to_statement = todata.transaction;
									to_statement.push(to_account)
									
								return this.AccountModel
									.findOneAndUpdate({account_number: args.beneficiary.account_number}, {$set: { balance: todata.balance + args.beneficiary.amount, transaction: to_statement}}, {'new':true})
									.exec()
									.then(transaction =>{
										return  {
											message: "transaction successfull"
										}
									})
					})
			})
		})
	}

	getStatement(req,res) {
		var args = req.body;
		return this.AccountModel
				.findOne({"account_number" : args.account_num,"transaction.tran_date":{$gte: new Date(args.from),$lte: new Date(args.to)}})
				.exec()
				.then(data =>{
					return {
						result : data.transaction
					}
				})
	}
}
