//Requests made to server//
const getCountryData = async (countryCode) => {
	const response = await fetch('/flags');
	const data = await response.json();
	return data;
}

const getWorldCovid = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

const getUsaCovid = async () => {
	const response = await fetch('/usa');
	const data = await response.json();
	return data;
}

const getWealth = async () => {
	const response = await fetch('/gini');
	const data = await response.json();
	return data;
}

const getConversionMatrixJSON = async () => {
	const response = await fetch('/countryCodeMatrix');
	const data = await response.json();
	return data;
}

export default;