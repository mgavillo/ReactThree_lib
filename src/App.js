import './App.css';
import React, {useRef, useMemo, Suspense, useEffect} from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Html, useGLTF, useAnimations } from "@react-three/drei"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'

extend({ OrbitControls});

const CameraControls = () => {  // Get a reference to the Three.js Camera, and the canvas html element.  // We need these to setup the OrbitControls component.  // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {    camera,    gl: { domElement },  } = useThree();
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

const Model = () => {
    const index= 0;
    const { nodes, animations } = useGLTF("/gltf/Wolf-Blender-2.82a.glb")
    // const texture = useTexture("/gltf.jpg")
    const { ref, actions, names } = useAnimations(animations)
  // Change animation when the index changes
    useEffect(() => {
    // Reset and fade in animation after an index has been changed
    actions[names[index]].reset().fadeIn(0.5).play()
    // In the clean-up phase, fade it out
    return () => actions[names[index]].fadeOut(0.5)
  }, [index, actions, names])
    console.log(getMethods(nodes))
    return(
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          castShadow
          receiveShadow
          geometry={nodes.Armature_0.geometry}
          skeleton={nodes.Armature_0.skeleton}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}>
          <meshStandardMaterial map-flipY={false} skinning />
        </skinnedMesh>
      </group>
    );
}

export default function App (){
    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[55]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <CameraControls />
            <Suspense fallback={<Html>"loading...."</Html>}> */
                <Model />
            </Suspense>
        </Canvas>
    );
};