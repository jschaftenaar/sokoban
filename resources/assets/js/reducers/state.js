export default function state(state = 'LOADING', action) {

	switch (action.type) {
		case 'SWITCH_STATE':
			return action.newState;
	}

     return state;
}
