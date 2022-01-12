import './App.css';
import React, {useRef, useMemo, Suspense} from "react";
import { Canvas, useFrame, useThree, extend, useLoader } from "@react-three/fiber";
import { Html, useFBX, useProgress, Environment} from "@react-three/drei"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'
import { FBXLoader } from 'three-stdlib';

extend({ OrbitControls});

const CameraControls = () => {  // Get a reference to the Three.js Camera, and the canvas html element.  // We need these to setup the OrbitControls component.  // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {    camera,    gl: { domElement },  } = useThree();
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <orbitControls ref={controls} args={[camera, domElement]} />;
};

function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
  }

const Model = () => {
    const fbx = useLoader(FBXLoader, 'Hoewa_Forsteriana_FBX/hoewa_Forsteriana.fbx')

    return(
        <primitive object={fbx} scale={0.005} />
    );
}

export default function App (){
    // const model = useLoader(
    //     GLTFLoader,
    //     'hoewa_Forsteriana.fbx'
    // )

    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[55]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <CameraControls />
            <Suspense fallback={<Loader/>}>
                <Model/>
                <Environment preset="sunset" background/>
            </Suspense>
        </Canvas>
    );
};