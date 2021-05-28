class Collection extends Map {
	constructor() {
		super();
	}

	static getPhone(id) {
		return (id || "").replace(/@.+/g, "");
	}

	id(key, value) {
		key = Collection.getPhone(key);
		if (value === undefined) {
			return super.get(key);
		} else {
			return super.set(key, value);
		}
	}
}

global.Collection = Collection;
module.exports = Collection;
