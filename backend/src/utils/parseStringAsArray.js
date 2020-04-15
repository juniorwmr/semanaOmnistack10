module.exports = function parseStringAsArray(arrayAsString) {
	//  .trim() -> remove espaços antes e depois
	return arrayAsString.split(",").map(tech => tech.trim());
};
