import './App.css';
import React, {useRef, useState, useMemo, useEffect, Suspense} from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { softShadows, Stage, Html } from "@react-three/drei"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'
import { AmbientLight } from 'three';

softShadows()
extend({ OrbitControls});

const CameraControls = () => {  // Get a reference to the Three.js Camera, and the canvas html element.  // We need these to setup the OrbitControls component.  // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {    camera,    gl: { domElement },  } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <orbitControls ref={controls} args={[camera, domElement]} />;
};

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        res.push(m)
    }
    return res;
}

function ObjToPrimitive({ url, mat }) {
    const [obj, setObj] = useState();
    useMemo(() => new OBJLoader().load(url, setObj), [url]);
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            // child.material = mat;
            // child.isMeshMatcapMaterial = true;
            if ( child.material.matcap )
                child.material.matcap.dispose();
                mat.needsUpdate = true;
                child.material.needsUpdate = true;
                child.material = mat;
                // console.log(child.material.isMeshMatcapMaterial)
            console.log(getMethods(child.material))
        }
      });
      return <primitive object={obj} />;
    }
    return null;
  }

const Dragon = () => {
    // const obj = useLoader(OBJLoader, '/stanford-dragon.obj');
    const [map] = useLoader(THREE.TextureLoader, ["/matcap_dark.png"])
    var mat = new THREE.MeshMatcapMaterial();
    mat.map = map;
    return(
        <mesh>
            {ObjToPrimitive({ url: "/stanford-dragon.obj", mat })}
        </mesh>
    );
}

export default function App (){

  
    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[65]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <color attach="background" args={["blue"]} />
            <CameraControls />
            <Suspense fallback={<Html><h1>Loading profile...</h1></Html>}>
                {/* <Stage> */}
                    <Dragon/>
                {/* </Stage> */}
            </Suspense>
            <ambientLight/>
        </Canvas>
    );
};