Prerequisites
=============

* node 4.2.3 or above
* npm
* mongoDB

Installation
============

From the root folders of the project execute:

```bash
npm install 
```

Configuration
=============

Edit config.json to mtach your enviornment.

```bash
gulp nodemon
```

api details:
============

1) url: localhost:9999/bank/create-bank-account

params: 

{
	"account_number": 5566,
	"account_name": "Priya",
	"ifsc_code": "ICIC0000003",
	"password": "pass12",
	"currency": "INR",
	"balance": 5000
}

response:

{
  "success": true,
  "message": "account created successfully"
}

2) url: localhost:9999/bank/login

params: 

{
	"account_number": 5566,
	"password": "pass12"
}

response:

{
  "success": true,
  "message": "user login successfully",
  "data": {
    "account_number": 5566,
    "session_id": "9d513fa4-9a2d-480e-b921-e2d4745c55e3"
  }
}

3) url: localhost:9999/bank/balance-info

params:

{
	"account_num": 5566,
	"sid": "9d513fa4-9a2d-480e-b921-e2d4745c55e3"
}

response:

{
  "success": true,
  "data": {
    "account_number": 5566,
    "balance": 5000,
    "currency": "INR"
  }
}

4) url: localhost:9999/bank/add-beneficiary

params:

{
	"account_num": 5566,
    "sid": "9d513fa4-9a2d-480e-b921-e2d4745c55e3",
	"beneficiary": {
		"account_number": 67891,
		"account_name": "Lisa",
		"ifsc_code": "ICIC0000003"
	}
}

response:

{
  "success": true,
  "message": "beneficiary added successfully",
  "data": {
    "account_number": 67891,
    "beneficiaries": [
      {
        "account_number": 67891,
        "account_name": "Lisa"
      }
    ]
  }
}

5) url: localhost:9999/bank/transaction

params:

{
	"account_num": 5566,
    "sid": "9d513fa4-9a2d-480e-b921-e2d4745c55e3",
	"beneficiary": {
		"account_number": 67891,
		"account_name": "Lisa",
		"ifsc_code": "ICIC0000003",
		"date":"03-06-2017",
		"amount": 400
	}
}

response:

{
  "success": true,
  "message": "transaction successfull"
}

6) url: localhost:9999/bank/statement

params:

{
	"account_num": 5566,
    "sid": "9d513fa4-9a2d-480e-b921-e2d4745c55e3",
	"from":"01-06-2017",
	"to":"06-06-2017"
}

response:

{
    "success": true,
    "data": [
        {
            "tran_date": "2017-03-05T18:30:00.000Z",
            "particulars": "67891/Lisa",
            "debit": 400,
            "credit": null,
            "balance": 4600,
            "_id": "59379910e69f2c0e23a6ce9f"
        },
        {
            "tran_date": "2017-01-05T18:30:00.000Z",
            "particulars": "67891/Lisa",
            "debit": 400,
            "credit": null,
            "balance": 4200,
            "_id": "593799f6e69f2c0e23a6cea1"
        },
        {
            "tran_date": "2017-05-05T18:30:00.000Z",
            "particulars": "67891/Lisa",
            "debit": 400,
            "credit": null,
            "balance": 3800,
            "_id": "593799fde69f2c0e23a6cea3"
        },
        {
            "tran_date": "2017-06-05T18:30:00.000Z",
            "particulars": "67891/Lisa",
            "debit": 400,
            "credit": null,
            "balance": 3400,
            "_id": "59379b48e69f2c0e23a6cea5"
        }
    ]
}


