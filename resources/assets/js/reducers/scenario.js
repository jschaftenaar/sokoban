export default function scenario(state = {}, action) {

	switch (action.type) {

		case 'LOADSCENARIO':
            let pack = Object.assign({}, action.scenario );
			pack.currentLevel=0;
			return pack;

		case 'PROGRESSLEVEL': 
	        let scenarioPack = Object.assign({}, state );
			scenarioPack.currentLevel++;
			return scenarioPack;

	}

    return state;
}
