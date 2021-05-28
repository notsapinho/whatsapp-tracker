import request from "./request";
import store from "./store";

class Client {
	constructor() {}

	async init(login = false) {
		if (!login) await this.register();
		this.getFollower();
		this.getPresences();
	}

	async register() {
		// if (localStorage.getItem("token")) return;
		var { user, token } = await request("/register", { method: "POST" });

		store.dispatch({ type: "SET_USER", payload: user });

		localStorage.setItem("token", token);
	}

	async getFollower() {
		var { follower } = await request("/follower");
		store.dispatch({ type: "SET_FOLLOWER", payload: follower });
	}

	async getPresences() {
		var { presences } = await request("/presences");
		store.dispatch({ type: "SET_PRESENCES", payload: presences });
	}
}

export default new Client();
