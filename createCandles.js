const fs = require('fs');
const startOfHour = require('date-fns/start_of_hour');
const getTime = require('date-fns/get_time');
const isAfter = require('date-fns/is_after');
const safeGet = require('lodash/get');

const absPath = process.argv.slice(2)[0] || '.';
const marketData = JSON.parse(
	fs.readFileSync(absPath + '/logs/BTC-ADT-201855045.json')
);

const createCandles = dataToParse => {
	dataToParse.reduce((acc, price) => {
		const theDate = new Date(price.TimeStamp);
		const startHour = startOfHour(theDate);
        const timestamp = getTime(startHour);
        console.log(startHour, timestamp);

		if (!safeGet(acc, startHour, false)) {
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
};

createCandles(marketData);
