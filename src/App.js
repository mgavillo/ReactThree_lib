import './App.css';
import React, {useRef, useState, useMemo, useEffect, Suspense} from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { softShadows, Stage, Html } from "@react-three/drei"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'

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
    const manager = new THREE.LoadingManager();
    let geometry = null;
    useMemo(() => new OBJLoader(manager).load(url, setObj), [url]);
    if (obj) {
      obj.traverse((child) => {
          if (child.isMesh)
            geometry = child.geometry;
      });
      return geometry;
    }
    console.log("prout")
    return null;
  }

const Dragon = () => {
    const [map] = useLoader(THREE.TextureLoader, ["/matcap_rainbow.png"])
    map.encoding = THREE.sRGBEncoding;
    const mat = new THREE.MeshMatcapMaterial();
    mat.matcap = map;
    let geometry= null;
    geometry = ObjToPrimitive({ url: "/stanford-dragon.obj", mat })
    if (geometry !== null){
        return(
            <mesh geometry={geometry} material={mat} color="#000000"/>
        );
    }
    return(
        <Html>Still loading...</Html>
    );

}

export default function App (){

    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[65]} } colorManagement={false}
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <color attach="background" args={["blue"]} />
            <CameraControls />
            <Suspense fallback={<Html><h1>Loading profile...</h1></Html>}>
                <Dragon/>
            </Suspense>
        </Canvas>
    );
};