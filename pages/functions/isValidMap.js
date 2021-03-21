const isValidMap = (map) => {
	const mapArr = map.split("\n").map((line) => {
		return line.split("");
	});
	console.log(mapArr);
	const width = mapArr[0].length;
	for (let i = 0; i < mapArr.length; i++) {
		if (width !== mapArr[i].length) return false;
		for (let j = 0; j < mapArr[i].length; j++) {
			if (mapArr[i][j] !== " " && mapArr[i][j] !== "#") {
				return false;
			}
		}
	}
	return true;
};

export default isValidMap;
