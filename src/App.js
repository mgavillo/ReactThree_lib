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

const Sphere = () => {
    const { scene, gl } = useThree();
    
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter,});
    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    cubeCamera.position.set(0, 100, 0);
    scene.add(cubeCamera);  // Update the cubeCamera with current renderer and scene.
    useFrame(() => cubeCamera.update(gl, scene));
    return(
        <mesh position={[0, 100, 0]}>
            <sphereBufferGeometry args={[350, 50, 50]} attach="geometry" />
            <meshBasicMaterial color={0xfff1ef} envMap={cubeCamera.renderTarget.texture} attach="material" />
        </mesh>
    );
}

export default function App (){
    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[55]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <CameraControls />
            <Suspense fallback={<Html>"loading...."</Html>}> */
                <Skybox/>
            </Suspense>
            <Sphere />
        </Canvas>
    );
};