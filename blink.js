var rp = require('request-promise');

// http://curl.trillworks.com/#node
// https://github.com/MattTW/BlinkMonitorProtocol


// curl - H "Host: prod.immedia-semi.com" - H "TOKEN_AUTH: authtoken from login" --compressed https://prod.immedia-semi.com/network/*network_id_from_networks_call*/syncmodules
// curl - H "Host: prod.immedia-semi.com" - H "TOKEN_AUTH: authtoken from login --data-binary "" --compressed https://prod.immedia-semi.com/network/*network_id_from_networks_call*/arm
// curl - H "Host: prod.immedia-semi.com" - H "TOKEN_AUTH: authtoken from login" --data- binary "" --compressed https://prod.immedia-semi.com/network/*network_id_from_networks_call*/disarm
// curl - H "Host: prod.immedia-semi.com" - H "TOKEN_AUTH: authtoken from login" --compressed https://prod.immedia-semi.com/network/*network_id*/command/*command_id*
// curl - H "Host: prod.immedia-semi.com" - H "TOKEN_AUTH: authtoken from login" --compressed https://prod.immedia-semi.com/homescreen

let authData = {};
let syncState = {};

function login() {
	const options = {
		url: 'https://prod.immedia-semi.com/login',
		method: 'POST',
		headers: {
			'Host': 'prod.immedia-semi.com',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: 'e@gmail.com',
			password: 'pass',
			client_specifier: 'iPhone 9.2 | 2.2 | 222'
		})
	};

	return rp(options)
		.then((body) => authData = JSON.parse(body))
		.catch((error) => console.log("Failed: ", error));
}

function getSyncModules() {
	const networkID = Object.keys(authData.networks)[0];

	const options = {
		url: `https://prod.immedia-semi.com/network/${networkID}/syncmodules`,
		method: 'POST',
		headers: {
			'Host': 'prod.immedia-semi.com',
			'TOKEN_AUTH': authData.authtoken.authtoken
		}
	};

	return rp(options)
		.then((body) => syncState = JSON.parse(body))
		.catch((error) => console.log("Failed: ", error));
}


login()
	.then(() => {
		console.log("authData => ", authData);
		getSyncModules()
	})
	.catch((error) => console.log("Couldn't get syncmodules: ", error))
	.then(() => console.log(syncState));
	// .then(() => toggleArm())
	// .catch((error) => console.log("Toggle arm failed: ", error));
