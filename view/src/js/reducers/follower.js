export default function follower(state = {}, action) {
	switch (action.type) {
		case "SET_FOLLOWER":
			return action.payload;
		case "LOADING_FOLLOWER":
			return "loading";
		case "EDIT_FOLLOWER":
		case "ADD_FOLLOWER":
			var newState = { ...state };
			newState[action.payload.id] = action.payload;
			return newState;
		case "REMOVE_FOLLOWER":
			var newState = { ...state };
			delete newState[action.payload];
			return newState;
		default:
			return state;
	}
}
