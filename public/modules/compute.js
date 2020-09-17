//Computation functions//
export function percent(value, total) {
	const result = Math.ceil( (value / total) * 100 );
	return result;
}

export function max(data, filter) {
	let max = 0;
	try {
		for( let item of data ) {
			if (filter(item) > max) {max = filter(item)};
		}
		return max;
		
	} catch (err) {
		console.error(err);
	}
}

export function naturalLog(value, multiplier = 1) {
	return ( Math.log(value) * multiplier ) + 0.5;
}

export function fatality(countryObject) {
	//Return a decimal value of country fatality rate
	try {
		//percent() is an export in this file, dangerous
		let fatality = percent(countryObject.TotalDeaths, countryObject.TotalConfirmed);
		let result = Math.ceil(fatality);
		return result;
		
	} catch (err) {
		console.error(err);
	}
}

export function gini(countryCode, data, matrix) {
	try {
		//Check for shortened country codes
		let code = matrix.filter( line => line.AlphaTwo == countryCode)[0].AlphaThree;
		let giniLine = data.filter( line => line.LOCATION == code )[0];
		let result = giniLine.Value * 100; //Convert to percentage
		return result;
	} catch (err) {
		return 0;
	}
}