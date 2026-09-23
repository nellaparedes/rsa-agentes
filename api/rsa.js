export default class rsa {

	constructor() {
	}

	/*
	**SET URL
	**WEB SERVICES
	**
	*/
	static getQueryURL = (module) => {
		let baseUrl = "https://app.rsa.ec/api/";
		// let baseUrl = "http://192.168.1.5/rsaapi/public/api/";
		let url = baseUrl;
		url += module;
		return url;
	}

	setFormBody = (params) => {
		var formBody = [];
		for (var property in params) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(params[property]);
			formBody.push(encodedKey + "=" + encodedValue);
		}
		formBody = formBody.join("&");
		return formBody;
	};


	/*
	**GET DATA
	**WEB SERVICES
	**
	*/
	urlFetch = (url, options) => {
		console.log(url);
		return fetch(url, options).then(res => res.json()).then(res => {
			if (res.code === 200) {
				return Promise.resolve(res.data);
			} else {
				return Promise.resolve(res);
			}
		}).catch(function (error) {
			console.warn('Error: ' + error.message);
			throw error;
		});
	};


	/*
	**
	**ROUTES APP
	**
	*/
	verifyEmail = (params) => {
		let url = rsa.getQueryURL('agents');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formBody
		};
		url += '/verify/email';
		return this.urlFetch(url, options);
	};

	setPasswords = (params) => {
		let url = rsa.getQueryURL('user');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formBody
		};
		url += '/set-password';
		return this.urlFetch(url, options);
	};

	loginUser = (params) => {
		let url = rsa.getQueryURL('user');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formBody
		};
		url += '/login';
		return this.urlFetch(url, options);
	};

	userIsLogin = (token) => {
		let url = rsa.getQueryURL('user');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
		url += '/is-auth';
		return this.urlFetch(url, options);
	};

	sendPushtoken = (token, params) => {
		let url = rsa.getQueryURL('user');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`,
			},
			body: formBody
		};
		url += '/add/push-token';
		return this.urlFetch(url, options);
	};

	getProfile = (token) => {
		let url = rsa.getQueryURL('user');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
		url += '/profile';
		return this.urlFetch(url, options);
	};

	userUpdate = (token, params) => {
		let url = rsa.getQueryURL('user');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`,
			},
			body: formBody
		};
		url += '/profile/update';
		return this.urlFetch(url, options);
	};

	getHome = (token) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
		url += '/home';
		return this.urlFetch(url, options);
	};

	getCompliance = (token) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
		url += '/compliance';
		return this.urlFetch(url, options);
	};

	getCommissions = (token) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		};
		url += '/commissions';
		return this.urlFetch(url, options);
	};

	getFolio = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/folio${params}`;
		return this.urlFetch(url, options);
	};

	getContracts = (token, client, tab) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/contracts/${client}/${tab}`;
		return this.urlFetch(url, options);
	};

	getPolicies = (token, tab) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/policies/${tab}`;
		return this.urlFetch(url, options);
	};

	getClaims = (token, tab) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/claims/${tab}`;
		return this.urlFetch(url, options);
	};

	getSac = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/sac${params}`;
		return this.urlFetch(url, options);
	};

	getPotentials = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/potentials${params}`;
		return this.urlFetch(url, options);
	};

	getCreationPotential = (token) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/potentials/creation`;
		return this.urlFetch(url, options);
	};

	storePotential = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let formBody = this.setFormBody(params);
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Bearer ${token}`,
			},
			body: formBody
		};
		url += '/potentials/store';
		return this.urlFetch(url, options);
	};

	getQuestions = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/questions${params}`;
		return this.urlFetch(url, options);
	};

	getConventions = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/conventions${params}`;
		return this.urlFetch(url, options);
	};

	getBirthdays = (token) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/notifications/birthdays`;
		return this.urlFetch(url, options);
	};

	getGenerals = (token, params) => {
		let url = rsa.getQueryURL('agents');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};
		url += `/notifications/generals${params}`;
		return this.urlFetch(url, options);
	};

}