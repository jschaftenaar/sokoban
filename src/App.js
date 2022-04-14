import './App.css';
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const i = {
  blank: 0,
  floor: 1,
  wall: 2,
  target: 3,
  player: 4,
  crate: 5,
  crate_placed: 6
}

const level = [
  [0,0,2,2,2,2,2,0],
  [2,2,2,1,1,1,2,0],
  [2,3,1,5,1,1,2,0],
  [2,2,2,1,5,3,2,0],
  [2,3,2,2,5,1,2,0],
  [2,1,2,1,3,1,2,2],
  [2,5,1,6,5,5,3,2],
  [2,1,1,1,3,1,1,2],
  [2,2,2,2,2,2,2,2],
];

function Level({currentPosition}) {
  const textureMap = {
    1: useLoader(TextureLoader, 'sokoban_floor.png'),
    2: useLoader(TextureLoader, 'sokoban_wall.png'),
    3: useLoader(TextureLoader, 'sokoban_target.png'),
    4: useLoader(TextureLoader, 'sokoban_player.png'),
    5: useLoader(TextureLoader, 'sokoban_crate.png'),
    6: useLoader(TextureLoader, 'sokoban_crate_placed.png')
  }
  return level.map((row, rowIndex) => (
    row.map((cell, columnIndex) => {
      let textureType = cell
      if (columnIndex === currentPosition.x && rowIndex===currentPosition.y) {
        textureType='4'
      }
      return (
        <mesh key={`${rowIndex}_${columnIndex}_${textureType}_${cell}`} position={[columnIndex-(level.length/2)+1, level.length-(rowIndex)-(level[0].length/2)-1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={textureMap[textureType]} />
        </mesh>
      )
    })
  ))
}

const moveToNewPosition = (newX, newY, currentPosition, setCurrentPosition) => {
  const deltaX = newX - currentPosition.x;
  const deltaY = newY - currentPosition.y; 
  if (!(newX >= 0 && newX < level[0].length && newY >= 0 && newY < level.length)) {
    return false
  } 
  if (level[newY][newX]===i.wall) {
    return false;
  }
  if ([i.crate, i.crate_placed].includes(level[newY][newX])) {
    switch(level[newY+deltaY][newX+deltaX]) {
      case i.floor:
        level[newY+deltaY][newX+deltaX] = i.crate;
        level[newY][newX] = level[newY][newX] === i.crate ? i.floor : i.target;
      break;
      case i.target:
        level[newY+deltaY][newX+deltaX] = i.crate_placed;
        level[newY][newX] = i.floor;
      break;
      default:
        return false;
    }
  }
  setCurrentPosition({y:newY, x: newX});
}

function App() {
  const [_currentPosition, _setCurrentPosition] = useState({x:2,y:2});
  const stateRef = useRef(_currentPosition);
  const setCurrentPosition = data => {
    stateRef.current = data;
    _setCurrentPosition(data)
  }
  useEffect(() => {
    const keyDownHandler = (event) => {
      let preventDefault = true;
      const currentPosition = stateRef.current;
      switch (event.key) {
        case 'ArrowUp':
          moveToNewPosition(currentPosition.x, currentPosition.y-1, currentPosition, setCurrentPosition)
        break;
        case 'ArrowRight':
          moveToNewPosition(currentPosition.x+1, currentPosition.y, currentPosition, setCurrentPosition)
        break;
        case 'ArrowDown':
          moveToNewPosition(currentPosition.x, currentPosition.y+1, currentPosition, setCurrentPosition)
        break;
        case 'ArrowLeft':
          moveToNewPosition(currentPosition.x-1, currentPosition.y, currentPosition, setCurrentPosition)
        break;
        default:
          preventDefault = false;
      }
      if (preventDefault) {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => { window.removeEventListener('keydown', keyDownHandler); }
  }, []);

  return (
    <div style={{backgroundColor:'#ff00ff'}}>
      <div style={{width:'800px', height:'600px', backgroundColor:'teal'}}>
        <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100]}}>
          <Suspense fallback={null}>
            <ambientLight />
            <Level currentPosition={stateRef.current}/>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
