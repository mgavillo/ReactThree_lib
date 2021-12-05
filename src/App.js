import './App.css';
import React, {useRef, useState} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Outline} from '@react-three/postprocessing'
import { softShadows } from "@react-three/drei"

softShadows()

function BoxMesh({position, onHover, args, color}){
    const ref = useRef(null);

    useFrame(() => {ref.current.rotation.x = ref.current.rotation.y += 0.01;});
    return(
        <mesh ref={ref}
            onPointerOver={(e) => onHover(ref)} onPointerOut={(e) => onHover(null)}
            castShadow position={position} >
            
            <boxBufferGeometry attach='geometry' args={args}/>
            <meshStandardMaterial attach='material' color={color} roughness={0} metalness={0.1}/>
        </mesh>
    );
};

export default function App (){
    const [hovered, onHover] = useState(null)
    const selected = hovered ? [hovered] : undefined

    return(
        <Canvas shadows camera={{position:[0, 1, 10], fov:[65]}} 
        style={{ width: window.innerWidth, height: window.innerHeight}}>
            <color attach="background" args={["blue"]} />
            <ambientLight intensity={0.2}/>
            <directionalLight 
                castShadow
                position={[0, 10, 0]}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-right={-10}
                shadow-camera-left={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <group>
                <mesh receiveShadow rotation={[-Math.PI /2, 0, 0]} position={[0, -3, 0]}>
                    <planeBufferGeometry attach="geometry" args={[100, 10000, 500, 100]}/>
                    <shadowMaterial attach="material" opacity={0.6} color={"navyBlue"}/>
                </mesh>
                <group>
                    <BoxMesh position={[0, 1, 0]} onHover={onHover} args={[3, 2, 1]} color="green"/>
                    <BoxMesh position={[-10, 1, -5]} onHover={onHover} args={[1, 1, 3]} color = "pink"/>
                    <BoxMesh position={[10, 1, -5]} onHover={onHover} args={[3, 1, 2]} color="pink"/>
                </group>
            </group>
            <EffectComposer multisampling={10} autoClear={false}>
                <Outline blur selection={selected} visibleEdgeColor="red" edgeStrength={55} width={850}/>
            </EffectComposer>
        </Canvas>
    );
};