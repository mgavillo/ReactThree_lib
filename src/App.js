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
var materials = {};
function BoxMesh({position, onHover, args, color}){
    const [active, setActive] = useState(false);
    const ref = useRef(null);

    useFrame(() => {ref.current.rotation.x = ref.current.rotation.y += 0.01;});
    return(
        <mesh ref={ref}
            onPointerOver={(e) => setActive(true)} onPointerOut={(e) => setActive(false)}
            castShadow position={position}
            userData={{ active }}>
            
            
            <boxBufferGeometry attach='geometry' args={args}/>
            <meshStandardMaterial attach='material' color={color} roughness={0} metalness={0.1}/>
        </mesh>
    );
};
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
const darkenNonBloomed = (obj) => {
    if (!obj.isMesh || obj.userData.active)
        return
    materials[obj.uuid] = obj.material
    obj.material = darkMaterial
    }
  
const restoreMaterial = (obj) => {
        if (!materials[obj.uuid])
            return
        obj.material = materials[obj.uuid]
        delete materials[obj.uuid]
}
function Effect() {
    const { gl, scene, camera, size } = useThree()
  
    const [bloom, final] = useMemo(() => {
      const renderScene = new RenderPass(scene, camera)
      const comp = new EffectComposer(gl)
      comp.renderToScreen = false
      comp.addPass(renderScene)
      comp.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), 1.5, 1, 0))
  
      const finalComposer = new EffectComposer(gl)
      finalComposer.addPass(renderScene)
      const material = new THREE.ShaderMaterial({
        uniforms: { baseTexture: { value: null }, bloomTexture: { value: comp.renderTarget2.texture } },
        vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
        fragmentShader:
          'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; vec4 getTexture( sampler2D texelToLinearTexture ) { return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) ); } void main() { gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) ); }'
      })
      material.map = true
      const finalPass = new ShaderPass(material, 'baseTexture')
      finalPass.needsSwap = true
      finalComposer.addPass(finalPass)
      return [comp, finalComposer]
    }, [])
  
    useEffect(() => {
      bloom.setSize(size.width, size.height)
      final.setSize(size.width, size.height)
      console.log(bloom.renderTarget1)
    }, [bloom, final, size])
  
    useFrame(() => {
      // https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_unreal_bloom_selective.html
      // this seems kinda dirty, it mutates the scene and overwrites materials
      scene.traverse(darkenNonBloomed)
      bloom.render()
      scene.traverse(restoreMaterial)
      // then writes the normal scene on top
      final.render()
    }, 1)
    return null
  }

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
            <ambientLight ref={lightRef1} intensity={0.2}/>
            <directionalLight
                ref={lightRef2} 
                castShadow
                position={[0, 5, 0]}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={50}
                shadow-camera-right={-10}
                shadow-camera-left={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            <mesh receiveShadow rotation={[-Math.PI /2, 0, 0]} position={[0, -3, 0]}>
                <planeBufferGeometry attach="geometry" args={[100, 10000, 500, 100]}/>
                <shadowMaterial attach="material" opacity={0.6} color={"black"}/>
            </mesh>
            <BoxMesh position={[0, 1, 0]} onHover={onHover} args={[3, 2, 1]} color="pink"/>
            <BoxMesh position={[-10, 1, -5]} onHover={onHover} args={[1, 1, 3]} color = "pink"/>
            <BoxMesh position={[10, 1, -5]} onHover={onHover} args={[3, 1, 2]} color="pink"/>
            <Effect/>
        </Canvas>
    );
};