import './App.css';
import React, {useRef, useState, useMemo, useEffect} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Bloom} from '@react-three/postprocessing'
import { softShadows } from "@react-three/drei"
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';


// import { BlurPass, Resizer, KernelSize, RenderPass, ShaderPass, EffectComposer, UnrealBloomPass} from 'three/examples/jsm/postprocessing'
import * as THREE from 'three'

softShadows()

export default function App (){
    const [hovered, onHover] = useState(null)
    // const selected = useRef(null);
    const lightRef1 = useRef(null);
    const lightRef2 = useRef(null);
    const selected = useRef(null);


    selected.current = hovered != null ? hovered.current : null;

    console.log(selected.current);
    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[65]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <color attach="background" args={["blue"]} />


        </Canvas>
    );
};