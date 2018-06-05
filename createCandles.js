const fs = require('fs');
const startOfHour = require('date-fns/start_of_hour');
const getTime = require('date-fns/get_time');
const isAfter = require('date-fns/is_after');
const safeGet = require('lodash/get');

const absPath = process.argv.slice(2)[0] || '.';
const marketData = JSON.parse(
	fs.readFileSync(absPath + '/logs/BTC-ADT-201855045.json')
);

const readLogs = coinPair => {
	return fs
		.readdirSync(absPath + '/logs')
		.filter(file => {
			if (file.indexOf(coinPair) >= 0) {
				return true;
			}

			return false;
		})
		.reduce((acc, curr) => {
			const logOutput = JSON.parse(
				fs.readFileSync(absPath + '/logs/' + curr)
			);

			acc = [...acc, ...logOutput];

			return acc;
		}, []);
};

const createCandles = dataToParse => {
	const output = dataToParse.reduce((acc, price) => {
		const theDate = new Date(price.TimeStamp);
		const startHour = startOfHour(theDate);
		const timestamp = getTime(startHour);

		if (!acc[timestamp]) {
			// OHLCV
			acc[timestamp] = [
				timestamp,
				price.Price,
				price.Price,
				price.Price,
				price.Price,
				0,
				price.TimeStamp
			];
		} else {
			// Volume
			acc[timestamp][6] += price.Quantity;
		}

		// Check Low
		if (price.Price < acc[timestamp][3]) {
			acc[timestamp][3] = price.Price;
		}

		// Check High
		if (price.Price > acc[timestamp][2]) {
			acc[timestamp][2] = price.Price;
		}

		// Close?
		if (isAfter(price.TimeStamp, acc[timestamp][6])) {
			acc[timestamp][4] = price.Price;
			acc[timestamp][6] = price.TimeStamp;
		}

		return acc;
	}, {});

	console.log(output);
};

const priceData = readLogs('BTC-ADT');
createCandles(priceData);
