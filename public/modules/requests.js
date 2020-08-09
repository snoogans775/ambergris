//Requests made to server//
export const flags = async (countryCode) => {
	const response = await fetch('/flags');
	const data = await response.json();
	return data;
}

export const worldCovid = async () => {
	const response = await fetch('/world');
	const data = await response.json();
	return data;
}

export const usaCovid = async () => {
	const response = await fetch('/usa');
	const data = await response.json();
	return data;
}

export const gini = async () => {
	const response = await fetch('/gini');
	const data = await response.json();
	return data;
}

export const conversionMatrixJSON = async () => {
	const response = await fetch('/countryCodeMatrix');
	const data = await response.json();
	return data;
}