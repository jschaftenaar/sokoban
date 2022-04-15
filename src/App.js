import './App.css';
import React, { useState, useEffect, Suspense } from 'react'
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

function Level({position, level}) {
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
      if (columnIndex === position.x && rowIndex===position.y) {
        textureType=i.player
      }
      let height = 1;
      if ([i.floor, i.target, i.blank].includes(textureType)) {
        height = 0;
      }
      return (
        <mesh key={`${rowIndex}_${columnIndex}_${textureType}_${cell}`} position={[(columnIndex-(level.length/2)+1), (level.length-(rowIndex)-(level[0].length/2)-1), height ? 0 : -.5]}>
          <boxGeometry args={[1, 1, height]} />
          <meshStandardMaterial map={textureMap[textureType]}/>
        </mesh>
      )
    })
  ))
}

const nextPosition = (newX, newY, position, setPosition, level, setLevel, history, setHistory) => {
  const newLevel = JSON.parse(JSON.stringify(level));
  const deltaX = newX - position.x;
  const deltaY = newY - position.y;
  if (!(newX >= 0 && newX < level[0].length && newY >= 0 && newY < level.length)) {
    return false
  } 
  if (level[newY][newX]===i.wall) {
    return false;
  }
  if ([i.crate, i.crate_placed].includes(level[newY][newX])) {
    switch(level[newY+deltaY][newX+deltaX]) {
      case i.floor:
        newLevel[newY+deltaY][newX+deltaX] = i.crate;
        newLevel[newY][newX] = (level[newY][newX] === i.crate) ? i.floor : i.target;
      break;
      case i.target:
        newLevel[newY+deltaY][newX+deltaX] = i.crate_placed;
        newLevel[newY][newX] = i.floor;
      break;
      default:
        return false;
    }
  }
  setHistory([...history, {position, level}]);
  setLevel(newLevel)
  setPosition({y:newY, x: newX});
}

function App() {
  const [position, setPosition] = useState({x:2,y:2});
  const [level, setLevel] = useState([
    [0,0,2,2,2,2,2,0],
    [2,2,2,1,1,1,2,0],
    [2,3,1,5,1,1,2,0],
    [2,2,2,1,5,3,2,0],
    [2,3,2,2,5,1,2,0],
    [2,1,2,1,3,1,2,2],
    [2,5,1,6,5,5,3,2],
    [2,1,1,1,3,1,1,2],
    [2,2,2,2,2,2,2,2],
  ])
  const [history, setHistory] = useState([]);
  const keyDownHandler = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      event.preventDefault();
      if (!history.length) {
         return false;
      }
      const last = history.pop();
      setHistory(history);
      setLevel(last.level);
      setPosition(last.position);
    } else {
      let preventDefault = true;
      switch (event.key) {
        case 'ArrowUp':
          nextPosition(position.x, position.y-1, position, setPosition, level, setLevel, history, setHistory)
        break;
        case 'ArrowRight':
          nextPosition(position.x+1, position.y, position, setPosition, level, setLevel, history, setHistory)
        break;
        case 'ArrowDown':
          nextPosition(position.x, position.y+1, position, setPosition, level, setLevel, history, setHistory)
        break;
        case 'ArrowLeft':
          nextPosition(position.x-1, position.y, position, setPosition, level, setLevel, history, setHistory)
        break;
        default:
          preventDefault = false;
      }
      if (preventDefault) {
        event.preventDefault();
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => { window.removeEventListener('keydown', keyDownHandler); }
  });
  return (
    <div style={{backgroundColor:'#ff00ff'}}>
      <div style={{width:'800px', height:'600px', backgroundColor:'teal'}}>
        <Canvas camera={{ fov: 70, position: [0, 0, 7] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Level position={position} level={level}/>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default App;
