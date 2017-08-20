'use strict';

const fetch = require('node-fetch');

export class Fetcher {
	
	static paramsToQueryString(params) {
		if (!params) return '';
		var list = [];
		for (var i in params) {
			list.push(i + '=' + params[i]);
		}
		return list.join('&');
	}
	
	static getJson(url, params, headers) {
		return fetch(url + this.paramsToQueryString(params), {
				headers: headers
			})
			.then(res => res.json());
	}
	
	static postJson(url, data, headers) {
		return this.post(url, JSON.stringify(data), headers);
	}
	
	static post(url, payload, headers) {
		return fetch(url, {
				headers: Object.assign({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}, headers),
				method: 'POST',
				body: payload
			})
			.then(res => res.json());
	}
	
}