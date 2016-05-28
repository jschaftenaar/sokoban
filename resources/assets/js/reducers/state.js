export default function state(state = 'MENU', action) {

	switch (action.type) {

		case 'LOADLEVEL':
			return 'GAME';

		case 'LOADING':
			return 'LOADING';

		case 'ERROR':
			return 'ERROR';

	}

      return state;
}
