const rp = require('request-promise');
const fs = require('fs');
const path = require('path');

const bittrexUrl = 'https://bittrex.com/api/v1.1/public/';

const getCoin = (coinPair = 'BTC-ADX') => {
	const absPath = process.argv.slice(2)[0] || '.';
	const markets = JSON.parse(fs.readFileSync(absPath + '/constants/markets.json'));
	const currentDate = new Date();
	const currentDateTimestamp = [
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate(),
		currentDate.getHours(),
		currentDate.getMinutes()
	];

	markets.forEach(market => {
		const url = bittrexUrl + 'getmarkethistory?market=' + market;

		rp(url)
			.then(result => JSON.parse(result))
			.then(result => {
				fs.writeFileSync(
					`${absPath}/logs/${market}-${currentDateTimestamp.join('')}.json`,
					JSON.stringify(result.result)
				);
			})
			.catch(err => {
				fs.writeFileSync(
					`${absPath}/errors/${market}-${currentDateTimestamp.join('')}.json`,
					err
				);
				throw err;
			});
	});
};

getCoin();
