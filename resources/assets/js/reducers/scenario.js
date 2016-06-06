export default function scenario(state = {}, action) {

	switch (action.type) {

		case 'LOAD_SCENARIO':
            let pack = Object.assign({}, action.scenario );
			pack.currentLevel=0;
			return pack;

		case 'PROGRESS_LEVEL': 
	        let scenarioPack = Object.assign({}, state );
			scenarioPack.currentLevel++;
			return scenarioPack;

	}

    return state;
}
