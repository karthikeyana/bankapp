'use strict';

import { BankApi } from './bank-api';

export default function(app) {

	new BankApi(app);

}
