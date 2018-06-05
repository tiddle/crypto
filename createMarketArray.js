const fs = require('fs');
const rp = require('request-promise');

const bittrexUrl = 'https://bittrex.com/api/v1.1/public/';

const getMarkets = () => {
	const url = bittrexUrl + 'getmarkets';

	rp(url)
		.then(result => JSON.parse(result))
		.then(result => {
			try {
				const output = result.result
					.filter(curr => curr.IsActive)
					.reduce((acc, curr) => {
						acc.push(curr.MarketName);
						return acc;
                    }, []);
                    console.log(output);
				fs.writeFileSync('./constants/markets.json', JSON.stringify(output));
			} catch (err) {
				console.log(err);
			}
		});
};

getMarkets();
