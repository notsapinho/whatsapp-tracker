export default (text) => {
	const decoder = document.createElement("div");
	decoder.textContent = text;
	return decoder.innerHTML;
};
