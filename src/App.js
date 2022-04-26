/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   App.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mgavillo <mgavillo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/02/06 01:20:58 by mgavillo          #+#    #+#             */
/*   Updated: 2022/04/15 18:49:28 by mgavillo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import BloomEffect from "./BloomEffect"
// [z, x, y]
// let gameState = [[[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
// [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
// [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
// [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
// [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]];
let currentDim = [2, 2, 1]
let pieces = [[[1, 1, 0, 0],
[1, 1, 0, 0]],
//
[[1, 1, 1, 0],
[0, 0, 1, 0]],
//
[[1, 1, 1, 1],
[0, 0, 0, 0]],
//
[[1, 1, 0, 0],
[0, 1, 1, 0]]]

let currentPiece;
let intervalPos = [0, 0, -8]
let intervalDir = [0, 0]
let currentOrientation = [1, 1]
let tetrisPoints = 0;
function arrayToWorld(pos) {
  const newArray = [pos[0] * 4 - 8, -((pos[1] * 4) - 8), (-pos[2] * 4) - 8]
  return (newArray)
}

function worldToArray(pos) {
  return [(pos[0] + 8) / 4, (-pos[1] + 8) / 4, (-pos[2] - 8) / 4]
}

function pieceToArray() {
  let arrayPositions = []
  let arrayPosition;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      if (pieces[currentPiece][i][j]) {
        arrayPosition = [i, j, 0]
        if (intervalDir[0] === 1) {
          if (i !== 0) {
            if (intervalDir[1] === 0)
              arrayPosition = [0, j, -i]
            else if (intervalDir[1] === -1)
              arrayPosition = [-i, j, 0]
            else if (intervalDir[1] === -2)
              arrayPosition = [0, j, i]
          }
        }
        else if (intervalDir[0] === 0) {
          if (j !== 0) {
            arrayPosition = [i, 0, -j]
          }
          if (i !== 0) {
            if (intervalDir[1] === 0)
              arrayPosition = [0, j, -i]
            else if (intervalDir[1] === -1)
              arrayPosition = [-i, j, 0]
            else if (intervalDir[1] === -2)
              arrayPosition = [0, j, i]
          }
        }
        else if (intervalDir[0] === -1) {
          if (j !== 0) {
            arrayPosition = [i, -j, 0]
          }
          if (i !== 0) {
            if (intervalDir[1] === 0)
              arrayPosition = [0, arrayPosition[1], i]
            else if (intervalDir[1] === -1)
              arrayPosition = [-i, arrayPosition[1], 0]
            else if (intervalDir[1] === -2)
              arrayPosition = [0, arrayPosition[1], -i]
          }
        }
        else if (intervalDir[0] === -2) {
          if (j !== 0) {
            arrayPosition = [i, 0, j]
          }
          if (i !== 0) {
            if (intervalDir[1] === 0)
              arrayPosition = [0, i, j]
            else if (intervalDir[1] === -1)
              arrayPosition = [-i, 0, j]
            else if (intervalDir[1] === -2)
              arrayPosition = [0, -i, j]
          }
        }
        arrayPositions.push(arrayPosition)
      }
    }
  }
  return arrayPositions
}

function getCubeArrayPos(cube, arrayPos) {
  let cubePos = []
  cubePos.push(cube[0] + arrayPos[0])
  cubePos.push(cube[1] + arrayPos[1])
  cubePos.push(cube[2] + arrayPos[2])
  return cubePos
}

function checkTouch(gameState, currentDirection) {
  console.log("real pos", intervalPos)
  let arrayPos = worldToArray(intervalPos)

  console.log("arrayPos = ", arrayPos)
  const piecePos = pieceToArray(arrayPos)
  for (let i = 0; i < piecePos.length; i++) {
    let cubePos = getCubeArrayPos(piecePos[i], arrayPos)
    console.log("wsh alors", cubePos)
    if (cubePos[2] === 11) {
      console.log("coucou")
      return 1
    }
    if (gameState[cubePos[0]][cubePos[1]][cubePos[2] + 1] === 1)
      return 1
  }
  return (0)
}


function checkOutsideBox(position) {
  const piecePos = pieceToArray()
  for (let i = 0; i < piecePos.length; i++) {
    let cubePos = getCubeArrayPos(piecePos[i], position)
    console.log("cubePos !!", cubePos)
    if (cubePos[0] < 0 || cubePos[0] > 4 || cubePos[1] < 0 || cubePos[1] > 4)
      return 1
  }
  return 0
}

function shiftTetris(newState, z) {
  for (let k = z - 1; k >= 0; k--) {
    for (let i = 0; i < newState.length; i++)
      for (let j = 0; j < newState[0].length; j++) {
        newState[i][j][k + 1] = newState[i][j][k]
      }
  }
  return newState
}

function checkTetris(gameState, setGameState) {
  let newState = gameState;
  let tetrisCount = 0;
  for (let k = gameState[0][0].length - 1; k >= 0; k--) {
    let count = 0;
    for (let i = 0; i < gameState.length; i++)
      for (let j = 0; j < gameState[0].length; j++)
        if (gameState[i][j][k] === 1)
          count++;
    if (count === gameState.length * gameState[0].length) {
      newState = shiftTetris(newState, k);
      setGameState(newState)

      tetrisCount += 1;
    }
    // else
    //   return k = -1
  }
  if (tetrisCount === 4)
    tetrisPoints += 100
  else
    tetrisPoints += 10 * tetrisCount
  console.log(tetrisPoints)
  setGameState(newState)
}

function setNewPiece(gameState, setGameState) {
  let arrayPos = worldToArray(intervalPos)
  let newState = gameState;
  const piecePos = pieceToArray(arrayPos)

  for (let i = 0; i < piecePos.length; i++) {
    const cubePos = getCubeArrayPos(piecePos[i], arrayPos)
    console.log("set cube", cubePos)
    newState[cubePos[0]][cubePos[1]][cubePos[2]] = 1
  }
  setGameState(newState)
}

const Cube = (props) => {
  const ref = useRef(null);
  const active = props.edges ? true : false;

  // console.log("CUBE", props.position)
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(4, 4, 4), 15);
  // scene.add(line);

  return (
    <mesh position={props.position} ref={ref} >
      <boxBufferGeometry attach="geometry" args={[4, 4, 4]} />
      <meshBasicMaterial attach="material" color={props.color} opacity={props.edges ? 0 : 1} transparent />
      {props.edges && <lineSegments raycast={() => null} geometry={edges} userData={{ active }}>
        <lineBasicMaterial color={"#FFFFFF"} linewidth={10} linejoin="round" linecap="round" attach='material' />
      </lineSegments>}
    </mesh>
  )
}

const GameCubes = (props) => {
  const [state, setState] = useState(props.gameState)

  // console.log(state[0][0].length)
  return (
    <group>
      {state && state.map((layer, zIndex) => {
        // console.log(layer.length)
        return layer.map((column, cIndex) => {
          // console.log(column.length)
          return column.map((item, index) => {

            if (item === 1) {
              // console.log("wsh", zIndex, cIndex, index)
              let color;
              if (index % 3 === 0)
                color = "#FF0000"
              if (index % 3 === 1)
                color = "#00FF00"
              if (index % 3 === 2)
                color = "#0000FF"
              let position = arrayToWorld([zIndex, cIndex, index])
              return <Cube position={position} color={color} edges={0} />
            }
          })
        })
      })}
    </group>

  )
}

const Square = (props) => {
  const pivotRef = useRef(null)

  let piece = pieces[currentPiece]
  if (pivotRef.current) {
    pivotRef.current.rotation.x = 1.5708 * (props.direction[0] - 1);
    pivotRef.current.rotation.y = 1.5708 * (props.direction[1] - 1);
    pivotRef.current.position.x = props.position[0];
    pivotRef.current.position.y = props.position[1];
    pivotRef.current.position.z = props.position[2];
  }
  return (
    <group ref={pivotRef}>
      <group >
        {piece[0][0] && <Cube position={[0, 0, 0]} color={"#0000FF"} edges={true} />}
        {piece[0][1] && <Cube position={[0, -4, 0]} color={"#FFFF00"} edges={true} />}
        {piece[0][2] && <Cube position={[0, -8, 0]} color={"#FF0000"} edges={true} />}
        {piece[0][3] && <Cube position={[0, -12, 0]} color={"#FF00FF"} edges={true} />}
        {piece[1][0] && <Cube position={[4, 0, 0]} color={"#FF00FF"} edges={true} />}
        {piece[1][1] && <Cube position={[4, -4, 0]} color={"#FF00FF"} edges={true} />}
        {piece[1][2] && <Cube position={[4, -8, 0]} color={"#FF00FF"} edges={true} />}
        {piece[1][3] && <Cube position={[4, -12, 0]} color={"#FF00FF"} edges={true} />}
        <meshBasicMaterial attach="material" color={"#FFFFFF"} />
      </group>
    </group>
  )
}

// const L = (props) => {
//   const ref = useRef(null)

//   // useFrame(() => {ref.current.rotation.x = ref.current.rotation.y += 0.01;});
//   return (
//     <mesh ref={ref}>
//       <Cube position={[0, 0, 0]} />
//       <Cube position={[0, 4, 0]} />
//       <Cube position={[0, 8, 0]} />
//       <Cube position={[4, 8, 0]} />
//       <meshBasicMaterial attach="material" wireframe={true} color={"#FFFFFF"} />
//     </mesh>
//   )
// }

// const Z = (props) => {
//   const ref = useRef(null)

//   // useFrame(() => {ref.current.rotation.x = ref.current.rotation.y += 0.01;});
//   return (
//     <mesh ref={ref}>
//       <Cube position={[0, 0, 0]} />
//       <Cube position={[0, 1, 0]} />
//       <Cube position={[1, 1, 0]} />
//       <Cube position={[1, 2, 0]} />
//       <meshBasicMaterial attach="material" wireframe={true} color={"#FFFFFF"} />

//     </mesh>
//   )
// }

// const T = (props) => {
//   const ref = useRef(null)

//   // useFrame(() => {ref.current.rotation.x = ref.current.rotation.y += 0.01;});
//   return (
//     <mesh ref={ref}>

//       <Cube position={[0, 0, 0]} />
//       <Cube position={[0, 1, 0]} />
//       <Cube position={[1, 1, 0]} />
//       <Cube position={[0, 2, 0]} />
//       <meshBasicMaterial attach="material" wireframe={true} color={"#FFFFFF"} />

//     </mesh>
//   )
// }


// const Line = (props) => {
//   const ref = useRef(null);
//   const onUpdate = useCallback(self => self.setFromPoints(props.points), [props.points])
//   return (
//     <line position={[0, 0, -10]} ref={ref}>
//       <bufferGeometry attach="geometry" onUpdate={onUpdate} />
//       <lineBasicMaterial attach="material" color={props.color} linewidth={50} linecap={'round'} linejoin={'round'} />
//     </line>

//   )
// }

export default function App() {
  const [boxLines, setBoxLines] = useState(null);
  const [currentPos, setCurrentPos] = useState([0, 0, -8]);
  const [currentColor, setCurrentColor] = useState('blue');
  const [currentDirection, setCurrentDirection] = useState([0, 0]);
  const [gameState, setGameState] = useState([[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]])
  // const [pieces, setPieces] = useState(n);
  // const [currentPos, setCurrentPos] = useState([0, 0, -8])
  // const [currentDim, setCurrentDim] = useState([2, 2])
  useEffect(() => {
    let linesCreate = [];
    linesCreate.push([new THREE.Vector3(-10, -10, 0), new THREE.Vector3(10, -10, 0), new THREE.Vector3(10, 10, 0), new THREE.Vector3(-10, 10, 0), new THREE.Vector3(-10, -10, 0)])
    linesCreate.push([new THREE.Vector3(-10, -10, -4), new THREE.Vector3(10, -10, -4), new THREE.Vector3(10, 10, -4), new THREE.Vector3(-10, 10, -4), new THREE.Vector3(-10, -10, -4)])
    linesCreate.push([new THREE.Vector3(-10, -10, -8), new THREE.Vector3(10, -10, -8), new THREE.Vector3(10, 10, -8), new THREE.Vector3(-10, 10, -8), new THREE.Vector3(-10, -10, -8)])
    linesCreate.push([new THREE.Vector3(-10, -10, -12), new THREE.Vector3(10, -10, -12), new THREE.Vector3(10, 10, -12), new THREE.Vector3(-10, 10, -12), new THREE.Vector3(-10, -10, -12)])
    linesCreate.push([new THREE.Vector3(-10, -10, -16), new THREE.Vector3(10, -10, -16), new THREE.Vector3(10, 10, -16), new THREE.Vector3(-10, 10, -16), new THREE.Vector3(-10, -10, -16)])
    linesCreate.push([new THREE.Vector3(-10, -10, -20), new THREE.Vector3(10, -10, -20), new THREE.Vector3(10, 10, -20), new THREE.Vector3(-10, 10, -20), new THREE.Vector3(-10, -10, -20)])
    linesCreate.push([new THREE.Vector3(-10, -10, -24), new THREE.Vector3(10, -10, -24), new THREE.Vector3(10, 10, -24), new THREE.Vector3(-10, 10, -24), new THREE.Vector3(-10, -10, -24)])
    linesCreate.push([new THREE.Vector3(-10, -10, -40), new THREE.Vector3(10, -10, -40), new THREE.Vector3(10, 10, -40), new THREE.Vector3(-10, 10, -40), new THREE.Vector3(-10, -10, -40)])
    linesCreate.push([new THREE.Vector3(-10, -10, -44), new THREE.Vector3(10, -10, -44), new THREE.Vector3(10, 10, -44), new THREE.Vector3(-10, 10, -44), new THREE.Vector3(-10, -10, -44)])
    linesCreate.push([new THREE.Vector3(-10, -10, -48), new THREE.Vector3(10, -10, -48), new THREE.Vector3(10, 10, -48), new THREE.Vector3(-10, 10, -48), new THREE.Vector3(-10, -10, -48)])
    linesCreate.push([new THREE.Vector3(-10, -10, -52), new THREE.Vector3(10, -10, -52), new THREE.Vector3(10, 10, -52), new THREE.Vector3(-10, 10, -52), new THREE.Vector3(-10, -10, -52)])


    linesCreate.push([new THREE.Vector3(-10, -10, 0), new THREE.Vector3(-10, -10, -52)])
    linesCreate.push([new THREE.Vector3(10, -10, 0), new THREE.Vector3(10, -10, -52)])
    linesCreate.push([new THREE.Vector3(10, 10, 0), new THREE.Vector3(10, 10, -52)])
    linesCreate.push([new THREE.Vector3(-10, 10, 0), new THREE.Vector3(-10, 10, -52)])

    linesCreate.push([new THREE.Vector3(-6, -10, 0), new THREE.Vector3(-6, -10, -52)])
    linesCreate.push([new THREE.Vector3(6, -10, 0), new THREE.Vector3(6, -10, -52)])
    linesCreate.push([new THREE.Vector3(6, 10, 0), new THREE.Vector3(6, 10, -52)])
    linesCreate.push([new THREE.Vector3(-6, 10, 0), new THREE.Vector3(-6, 10, -52)])

    linesCreate.push([new THREE.Vector3(-2, -10, 0), new THREE.Vector3(-2, -10, -52)])
    linesCreate.push([new THREE.Vector3(2, -10, 0), new THREE.Vector3(2, -10, -52)])
    linesCreate.push([new THREE.Vector3(2, 10, 0), new THREE.Vector3(2, 10, -52)])
    linesCreate.push([new THREE.Vector3(-2, 10, 0), new THREE.Vector3(-2, 10, -52)])

    linesCreate.push([new THREE.Vector3(-10, -6, 0), new THREE.Vector3(-10, -6, -52)])
    linesCreate.push([new THREE.Vector3(10, -6, 0), new THREE.Vector3(10, -6, -52)])
    linesCreate.push([new THREE.Vector3(10, 6, 0), new THREE.Vector3(10, 6, -52)])
    linesCreate.push([new THREE.Vector3(-10, 6, 0), new THREE.Vector3(-10, 6, -52)])

    linesCreate.push([new THREE.Vector3(-10, -2, 0), new THREE.Vector3(-10, -2, -52)])
    linesCreate.push([new THREE.Vector3(10, -2, 0), new THREE.Vector3(10, -2, -52)])
    linesCreate.push([new THREE.Vector3(10, 2, 0), new THREE.Vector3(10, 2, -52)])
    linesCreate.push([new THREE.Vector3(-10, 2, 0), new THREE.Vector3(-10, 2, -52)])


    linesCreate.push([new THREE.Vector3(10, -6, -52), new THREE.Vector3(-10, -6, -52)])
    linesCreate.push([new THREE.Vector3(10, -2, -52), new THREE.Vector3(-10, -2, -52)])
    linesCreate.push([new THREE.Vector3(10, 2, -52), new THREE.Vector3(-10, 2, -52)])
    linesCreate.push([new THREE.Vector3(10, 6, -52), new THREE.Vector3(-10, 6, -52)])

    linesCreate.push([new THREE.Vector3(-6, 10, -52), new THREE.Vector3(-6, -10, -52)])
    linesCreate.push([new THREE.Vector3(-2, 10, -52), new THREE.Vector3(-2, -10, -52)])
    linesCreate.push([new THREE.Vector3(2, 10, -52), new THREE.Vector3(2, -10, -52)])
    linesCreate.push([new THREE.Vector3(6, 10, -52), new THREE.Vector3(6, -10, -52)])
    console.log("RANDOM", Math.floor(Math.random() * 4))
    currentPiece = Math.floor(Math.random() * 4)
    setBoxLines(linesCreate)
    const intervalId = setInterval(() => {
      intervalPos = [intervalPos[0], intervalPos[1], intervalPos[2] - 4]
      setCurrentPos(intervalPos)
      console.log("current", intervalPos)
      if (checkTouch(gameState, currentDirection)) {
        // clearInterval(intervalId)
        console.log("state changed")
        setNewPiece(gameState, setGameState);
        checkTetris(gameState, setGameState);
        intervalPos = [0, 0, -8]
        currentPiece = Math.floor(Math.random() * 4)
        setCurrentPos(intervalPos)
        setCurrentColor("blue")

      }
    }, 1000)
    return () => clearInterval(intervalId);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "ArrowDown") {
      let arrayPos = worldToArray(intervalPos)
      arrayPos[1] += 1;
      if (!checkOutsideBox(arrayPos)) {
        intervalPos = [currentPos[0], currentPos[1] - 4, currentPos[2]]
        setCurrentPos(intervalPos)
      }
    }
    else if (e.key === "ArrowUp") {
      let arrayPos = worldToArray(intervalPos)
      arrayPos[1] -= 1;
      if (!checkOutsideBox(arrayPos)) {
        intervalPos = [currentPos[0], currentPos[1] + 4, currentPos[2]]
        setCurrentPos(intervalPos)
      }
    }
    else if (e.key === "ArrowRight") {
      let arrayPos = worldToArray(intervalPos)
      arrayPos[0] += 1;
      if (!checkOutsideBox(arrayPos)) {
        // if (1) {
        intervalPos = [currentPos[0] + 4, currentPos[1], currentPos[2]]
        setCurrentPos(intervalPos)
      }

    }
    else if (e.key === "ArrowLeft") {
      let arrayPos = worldToArray(intervalPos)
      arrayPos[0] -= 1;
      if (!checkOutsideBox(arrayPos)) {
        // if(1){
        intervalPos = [currentPos[0] - 4, currentPos[1], currentPos[2]]
        setCurrentPos(intervalPos)
      }
    }
    else if (e.key === "s") {
      let newDir = Object.assign({}, currentDirection);
      if (currentDirection[0] === 1)
        newDir[0] = -2
      else
        newDir[0] += 1
      let prevDir = intervalDir;
      intervalDir = newDir;
      let arrayPos = worldToArray(intervalPos)
      if (checkOutsideBox(arrayPos))
        intervalDir = prevDir
      else
        setCurrentDirection(newDir)
    }
    else if (e.key === "z") {
      let newDir = Object.assign({}, currentDirection);
      if (currentDirection[0] === -2)
        newDir[0] = 1;
      else
        newDir[0] -= 1

      let prevDir = intervalDir;
      intervalDir = newDir;
      let arrayPos = worldToArray(intervalPos)
      if (checkOutsideBox(arrayPos))
        intervalDir = prevDir
      else
        setCurrentDirection(newDir)
    }
    else if (e.key === "q") {
      let newDir = Object.assign({}, currentDirection);
      if (currentDirection[1] === 1)
        newDir[1] = -2
      else
        newDir[1] += 1
      let prevDir = intervalDir;
      intervalDir = newDir;
      let arrayPos = worldToArray(intervalPos)
      if (checkOutsideBox(arrayPos))
        intervalDir = prevDir
      else
        setCurrentDirection(newDir)
    }
    else if (e.key === "d") {
      let newDir = Object.assign({}, currentDirection);
      // console.log("prev", newDir)
      if (currentDirection[1] === -2)
        newDir[1] = 1
      else
        newDir[1] -= 1
      let prevDir = intervalDir;
      intervalDir = newDir;
      let arrayPos = worldToArray(intervalPos)
      if (checkOutsideBox(arrayPos))
        intervalDir = prevDir
      else
        setCurrentDirection(newDir)
    }
  }
  // useEffect(() => {
  //   console.log('Fruit', currentDirection);
  // }, [currentDirection])

  console.log("state", currentDirection)
  return (
    <div id="container" style={{ width: window.innerWidth, height: window.innerHeight }} onKeyDown={handleKeyPress} tabIndex={-1} >
      <Canvas shadows style={{ width: "600px", height: "600px" }} >
        <color attach="background" args={["blue"]} />
        <ambientLight intensity={0.2} />
        {/* <Square position={[2, 2, -8]} /> */}
        <Square position={currentPos} color={currentColor} direction={currentDirection} />
        <GameCubes gameState={gameState} />
        {boxLines && boxLines.map((line) => {
          console.log("linnnes", line)
          return <Line points={line} color={"#FF0000"} lineWidth={0.5} />
        })}
        {/* <BloomEffect/> */}
      </Canvas>
    </div>
  )
}
