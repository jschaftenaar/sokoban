export function loadUser(user) {
	return {
		type: 'SET_USER',
		user: user
	};
}

export function errorHappened(error) {
	return {
		type: 'ERROR',
		error
	};
}

export function switchState(newState) {
	return {
		type: 'SWITCH_STATE',
		newState
	}
}

export function movePlayer(direction) {
	return {
		type: 'MOVE_PLAYER_'+direction
	}
}
