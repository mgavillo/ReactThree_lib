import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useThree, extend, Environment} from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei"
import React, {useRef, useState, useMemo, useEffect, Suspense} from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        res.push(m)
    }
    return res;
}

extend({ OrbitControls});
const CameraControls = () => {  // Get a reference to the Three.js Camera, and the canvas html element.  // We need these to setup the OrbitControls component.  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {    camera,    gl: { domElement },  scene,} = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => {

    controls.current.update()
    // if(controls.current !== tmp){

      scene.traverse(function(child) {
      if (child.name === "cloud") {
          child.quaternion.copy(camera.quaternion);  
        }
      });
  });
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

const Background = () => {
  const texture = useTexture("/bg.jpg")
  return(
    <mesh name="cloud" position={[0, 0, -100]} transparent>
      <planeBufferGeometry attach="geometry" args={[20, 20]} rotateX={Math.random * 2} />
      <meshStandardMaterial attach="material" map={texture} transparent opacity={0.5}/>
    </mesh>
  )
}

const Cloud = (props) => {
  const { camera } = useThree();
  const ref = useRef(null);

  

    return(
        <mesh name='cloud' ref={ref} position={[Math.random() * 10, Math.random() * 5, Math.random() * 12]} lookAt={camera.position} rotation={[Math.random() * 30]} transparent>
          <planeBufferGeometry attach="geometry" args={[5, 5]} rotateX={Math.random * 2} />
          <meshStandardMaterial attach="material" map={props.texture} transparent opacity={Math.random()}/>
        </mesh>
    );
}

const Clouds = (texture) => {
  const textures = [useTexture("/cloud.png"), useTexture("/cloud1.png"), useTexture("/cloud2.png"), useTexture("/cloud3.png")];
  return(
    <group>
      {Array.from({length: 100}, (item, index) => <Cloud key={index} texture={textures[Math.floor(Math.random() * 3.9)]}/> )}
    </group>
  );
}

export default function App() {

  return (
    <Canvas shadows camera={{position:[0, 1, 10], fov:[65]} } colorManagement={false}
      style={{ width: window.innerWidth, height: window.innerHeight}}>
      
      <fog attach="fog" args={["white", 100, -99]} opacity={0.5} />
      <color attach="background" args={["blue"]} />
      <Suspense fallback={<Html>loading....</Html>}>
        <Background/>
        <Clouds/>
      </Suspense>
      <CameraControls />

      <ambientLight/>
    </Canvas>
  );
}
