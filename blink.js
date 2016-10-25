var rp = require('request-promise');
var fs = require('fs');

let credentials = JSON.parse(
	fs.readFileSync('credentials.json')
);

const hostname = "prod.immedia-semi.com";

// https://github.com/MattTW/BlinkMonitorProtocol
// http://curl.trillworks.com/#node

function login() {
	const options = {
		url: `https://${hostname}/login`,
		method: 'POST',
		headers: { 'Host': hostname, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: credentials.email,
			password: credentials.password,
			client_specifier: 'iPhone 9.2 | 2.2 | 222'
		})
	};

	return rp(options).then((body) => JSON.parse(body));
}

function getHomescreen(authData) {
	const options = {
		url: `https://${hostname}/homescreen`,
		headers: { 'Host': hostname, 'TOKEN_AUTH': authData.authtoken.authtoken }
	};

	return rp(options).then((body) => [authData, JSON.parse(body)]);
}

function toggleArm(data) {
	const networkID = Object.keys(data[0].networks)[0];
	const url = data[1].network.armed ? `https://${hostname}/network/${networkID}/disarm` : `https://${hostname}/network/${networkID}/arm`;
	const options = {
		url: url,
		method: 'POST',
		headers: { 'Host': hostname, 'TOKEN_AUTH': data[0].authtoken.authtoken }
	};

	return rp(options).then((body) => JSON.parse(body));
}

// Login, get the current status, and either arm or disarm the system
login()
	.then((authData) => getHomescreen(authData))
	.then((data) => toggleArm(data))
	.then((toggleResult) => console.log(`System has been ${toggleResult.command}ed`))
	.catch((error) => console.log("Error: ", error));
