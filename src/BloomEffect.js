import React, {useRef, useState, useMemo, useEffect} from "react";
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as THREE from 'three'

var materials = {};
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' })
const darkenNonBloomed = (obj) => {
    console.log("obj, ", obj)
    if ( !obj.userData)
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

export default function BloomEffect() {
    const { gl, scene, camera, size } = useThree()
  
    const [bloom, final] = useMemo(() => {
      const renderScene = new RenderPass(scene, camera)
      const comp = new EffectComposer(gl)
      comp.renderToScreen = false
      comp.addPass(renderScene)
      comp.addPass(new UnrealBloomPass(new THREE.Vector2(512, 512), 5, 4, 0))
  
      const finalComposer = new EffectComposer(gl)
      finalComposer.addPass(renderScene)
      const material = new THREE.ShaderMaterial({
        uniforms: { baseTexture: { value: null }, bloomTexture: { value: comp.renderTarget2.texture } },
        vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }',
        fragmentShader:
          'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; vec4 getTexture( sampler2D texelToLinearTexture ) { return  texture2D( texelToLinearTexture , vUv ); } void main() { gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) ); }'
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