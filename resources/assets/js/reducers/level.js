export default function level(state = {}, action) {

    let repeatArrayPush = function(number, item, array) {
        for (let counter = 0; counter<number; counter++) {
            array.push(item);
        };
    }

    let expandRow = function(row) {
        let cells = row.split(/(\d+|\D{1})/).filter(Boolean),
            result = [];

        for (let counter = 0; counter<cells.length; counter++) {
            if (isNaN(cells[counter])) {
                result.push(cells[counter]);
            } else {
                repeatArrayPush(
                    cells[counter],
                    cells[counter+1],
                    result
                );
                counter++;
            }
        }

        return result;
    }

    let movePlayer = function(yOffset = 0, xOffset = 0 ) {
        let playerX,
            playerY,
            playerState,
            itemState,
            newItemState,
            bondItemState,
            newBondItemState,
            newPlayerState,
            level = Object.assign({}, state);

            level.map.find(function(row, indexY) {
                return row.find(function(cell, indexX) {
                    if ('@+'.indexOf(cell)!==-1)
                    {
                        playerY = indexY;
                        playerX = indexX;
                        playerState = cell;
                        itemState = level.map[indexY+yOffset][indexX+xOffset];
                        bondItemState = level.map[indexY+yOffset+yOffset][indexX+xOffset+xOffset];
                        return true;
                    }
                });
            });

            newItemState = (playerState == '+') ? '.' : '-';
            newPlayerState = ('*.'.indexOf(itemState)!==-1) ? '+' : '@';

            if (' -_.'.indexOf(itemState)!==-1) {
                level.map[playerY+yOffset][playerX+xOffset]=newPlayerState
                level.map[playerY][playerX]=newItemState
                level.floorMoves++;
            } 

            if ('$*'.indexOf(itemState)!==-1 &&
                ' -_.'.indexOf(bondItemState)!==-1 ) {
                newBondItemState = (bondItemState == '.') ? '*' : '$';
                level.map[playerY+yOffset+yOffset][playerX+xOffset+xOffset]=newBondItemState
                level.map[playerY+yOffset][playerX+xOffset]=newPlayerState;
                level.map[playerY][playerX]=newItemState;
                level.boxMoves++;
            }

            level.finished = !level.map.find(function(row) {
                return row.find(function(cell) {
                    return '+.'.indexOf(cell)!==-1;
                });
            });

            return level;
    };

    switch (action.type) {
        case 'LOADLEVEL':
            console.log(action.scenario);
            level = Object.assign({},
                action.scenario.levels[action.scenario.currentLevel]
            )
            level.map = level.map.split('|').map(expandRow);
            level.boxMoves = 0;
            level.floorMoves = 0;
            // should be tried to load from scenario pack first
            level.style = {
                wall: 'url(data:image/gif;base64,R0lGODlhIAAgAIAAADAwMISEhCH5BAAAAAAALAAAAAAgACAAAAJQhI+pm+EPI4gUzlovlpvq7nyg2JGbiaEZaLGP6jHyjKRueAcwd+9tn/O9gkSg0WWiKWdFZJMlxB2hz1G1dD0Fl9zaamoFY8Vass38daI9lQIAOw==)',
                player: 'url(data:image/gif;base64,R0lGODlhIAAgAMQAAJaWlmtVRevnkmpsN7mokqquYnNzc8/RbQFhuMDAwJlvQP//hCiX/sa9lNjY2AAAAN7WrQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAgACAAAAX/ICSOUGM2xqOuqiGeDSnPbL3O+Jyuhf24uWBtMfAFX6cRq7AoFGvHHG9BrQqeyejpMah6F4JDMYrjLlbglfhBLlMB1MMCEGa3aXJqWH+wk2AzMCp5Vn1sWXcQgweMjCqJMioJADYAlH5tkg6bm5OWAAmhj4EmSgmcqA6hq5wJmGWnrZyWqa2vJA8AqKG1qqmTD6WRvKoPsQ60qq6xolJUorq9qpSqVLeKVQeuCggICt/g3QrG2a8ND+UPAQwMAe7v7AEq5WWOit34+fhqfUJ2D+wCIggY8N+1MgQZDEx4sASiEgAJdmPoUFiUiAUxsmsohOA/j5BEPMj3jySpGEhKIj0gAE6eSJbf5D2UAjNmsHM1v3FUAq7lv57gdiryYdCIjBAAOw==)',
                playerGoal: 'url(data:image/gif;base64,R0lGODlhIAAgAMQAAMDAwM/Rbd+uomtVRWpsN+vnkpaWlqquYrmoknNzc9jY2AFhuJlvQP//hCiX/sa9lNWWhgAAAN7WrQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAgACAAAAX/oCSO0mM+SaSuaiKeDynPbL3O+Jyuhx25uWCtQfAFX6cR69A4FGvHHK9BrRaeyegpQqh6G4VAMYrjNlbglThCLlMN1EDDEGa3aXJqWB+wk2AzMCpyAhCGAn1sWXcSKoaPhn6MIioAkJcqk5UKhZePAgCZgSZKAAqnnpenoVERpqcKqZCwrFIGsAqWsoa0BhGkMq6voZ2poKu1NFQAobe7vrlUkkpVAaEMCwupCwyu1dMPEd8RAw4OA8UC5gMq32UBfY3Z8/TzavFSdhHm/Av8/PqmCfnnwB9BgSMAJdz3L9vBEouOMAQ40RzCVv/0ZZxEiZ4+j6NiICEVAQGDk+woHZlE+QuYxJUsTZQ8SfNiMJo0UzbCWZOMD1E/BYYAADs=)',
                box: 'url(data:image/gif;base64,R0lGODlhIAAgAKIAAP/aqN7Wrdl8AAAAAP+1UgAAAAAAAAAAACH5BAAAAAAALAAAAAAgACAAAAPKGLrc/m3ISau9Ug3Au/8gSAwaQJxoqq6qQAYbK8+nW9ZCru88j9owE8GFKUqEwNhwkGP2eE5lEskkAJxPl0lbe0mrVrDqS70tBagrOvX9monrMJvKXb6Z4uvp2ywHu01xV3xLfnyBaQOAXYZ0aC6CeHF1U4BxeWKFXXc5KBKRKZRejnsAkIk/bn9naIQnepp2q5Cip6+KopyumLmzR4uecSOqrrZsk8SOtE9YvW1GGI1pIdQfm6s02alm2tpJQ1nh4V7Q5RYQ6OkOCQA7)',
                boxGoal: 'url(data:image/gif;base64,R0lGODlhIAAgAKIAALqOV97WrYwtAAAAALplDQAAAAAAAAAAACH5BAAAAAAALAAAAAAgACAAAAPKGLrc/m3ISau9Ug3Au/8gSAwaQJxoqq6qQAYbK8+nW9ZCru88j9owE8GFKUqEwNhwkGP2eE5lEskkAJxPl0lbe0mrVrDqS70tBagrOvX9monrMJvKXb6Z4uvp2ywHu01xV3xLfnyBaQOAXYZ0aC6CeHF1U4BxeWKFXXc5KBKRKZRejnsAkIk/bn9naIQnepp2q5Cip6+KopyumLmzR4uecSOqrrZsk8SOtE9YvW1GGI1pIdQfm6s02alm2tpJQ1nh4V7Q5RYQ6OkOCQA7)',
                floor: 'url(data:image/gif;base64,R0lGODlhIAAgAIAAAMa9lN7WrSH5BAAAAAAALAAAAAAgACAAAAJGjB+ggH3LnJy0WrNuzVrCDoYPtykNKabqylLfibpmSztQVKtxjrzyzPMAg0TdMOQrHYvMphKXSAqXTiS1SpJedhpt9dsoAAA7)',
                goal: 'url(data:image/gif;base64,R0lGODlhIAAgAJEAAN+uotWWhsa9lN7WrSH5BAAAAAAALAAAAAAgACAAAAJcnD+ign3LnJy0WrNuzVrCDoYPtykNKabqylLfiQLBDCAoOOdza+h+K/Plai6TRPjrvJA6o4iZg0UsQSRxBW0pkMrboQp48cbksnSaEE/UZp637SCxL296HY63FAAAOw==)'
            };
            return level;

        case 'MOVERIGHT': 
            return movePlayer(0, 1);

        case 'MOVELEFT': 
            return movePlayer(0, -1);

        case 'MOVEDOWN': 
            return movePlayer(1, 0);

        case 'MOVEUP': 
            return movePlayer(-1, 0);

    }

    return state;
}
