export default function presences(state = {}, action) {
	switch (action.type) {
		case "SET_PRESENCES":
			return action.payload;
		case "LOADING_PRESENCES":
			return "loading";
		case "REFRESH_PRESENCE":
			var newState = { ...state };
			newState[action.payload.id] = action.payload.presence;
			return newState;
		default:
			return state;
	}
}
