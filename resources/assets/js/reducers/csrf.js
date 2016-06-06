export default function csrf(state = '', action) {

	switch (action.type) {

		case 'SET_CSRF':
			return action.csrf;
	}

    return state;
}
