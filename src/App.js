import './App.css';
import React, {useRef, useMemo, Suspense} from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Html } from "@react-three/drei"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'

extend({ OrbitControls});

const CameraControls = () => {  // Get a reference to the Three.js Camera, and the canvas html element.  // We need these to setup the OrbitControls component.  // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {    camera,    gl: { domElement },  } = useThree();
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <orbitControls ref={controls} args={[camera, domElement]} />;
};

const Skybox = () => {
    const { scene } = useThree();
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(["/DallasW/posx.jpg", "/DallasW/negx.jpg", "/DallasW/posy.jpg", "/DallasW/negy.jpg", "/DallasW/posz.jpg","/DallasW/negz.jpg",  ]);
    scene.background = texture;
    return(null);
}

export default function App (){
    return(
        <Canvas shadows camera={{position:[1200, -250, 20000], fov:[55]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <CameraControls />
            <Suspense fallback={<Html>"loading...."</Html>}>
                <Skybox/>
            </Suspense>
        </Canvas>
    );
};