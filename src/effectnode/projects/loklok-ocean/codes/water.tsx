import {
  Center,
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { WaterMesh } from 'three/addons/objects/WaterMesh.js'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'
import { MathUtils, PlaneGeometry, RepeatWrapping, TextureLoader, Vector3 } from 'three'
import { CanvasGPU, rgbeLoader } from '../../../../components/CanvasGPU/CanvasGPU'
import { EnvLoader } from '@/components/CanvasGPU/EnvLoader'

export function ToolBox({ useNodeMemory }: any) {
  return (
    <>
      <div className='w-full h-full'>
        <CanvasGPU>
          <ReusableComponent useNodeMemory={useNodeMemory}></ReusableComponent>

          <EnvLoader url={`/hdr/default.hdr`}></EnvLoader>
          {/* <PerspectiveCamera position={[0, 3.5, 3.5]} makeDefault></PerspectiveCamera> */}

          <OrbitControls makeDefault></OrbitControls>
        </CanvasGPU>
      </div>
    </>
  )
}

export function Runtime({ useNodeMemory, io }: any) {
  useEffect(() => {
    io.input(0, (v) => {
      useNodeMemory.setState({
        baseColor: v,
      })
    })
  }, [io])

  return (
    <>
      <ReusableComponent useNodeMemory={useNodeMemory}></ReusableComponent>
    </>
  )
}

export function NodeBox({ useNodeMemory }: any) {
  return (
    <>
      <group position={[2, 0, 0]} scale={0.5}>
        {/* <ReusableComponent useNodeMemory={useNodeMemory}></ReusableComponent> */}
      </group>
    </>
  )
}

function ReusableComponent({ useNodeMemory }: any) {
  let baseColor = useNodeMemory((r) => r.baseColor)
  let scene = useThree((r) => r.scene)
  let gl = useThree((r) => r.gl)

  useEffect(() => {
    if (!gl) {
      return
    }
    const sun = new Vector3()
    const sunDirection = new Vector3(0, 1, 0)

    const waterGeometry = new PlaneGeometry(10000, 10000)
    const loader = new TextureLoader()
    const waterNormals = loader.load('/textures/waternormals.jpg')
    waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping

    const water = new WaterMesh(waterGeometry, {
      waterNormals: waterNormals,
      sunDirection: sunDirection,
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
    })

    water.rotation.x = -Math.PI / 2

    water.position.y -= 9

    scene.add(water)

    const sky = new SkyMesh()
    sky.scale.setScalar(10000)
    scene.add(sky)

    sky.turbidity.value = 10
    sky.rayleigh.value = 2
    sky.mieCoefficient.value = 0.005
    sky.mieDirectionalG.value = 0.8

    const parameters = {
      elevation: 2,
      azimuth: 180,
    }

    scene.add(sky)

    function updateSun() {
      const phi = MathUtils.degToRad(90 - parameters.elevation)
      const theta = MathUtils.degToRad(parameters.azimuth)

      sun.setFromSphericalCoords(1, phi, theta)

      sky.sunPosition.value.copy(sun)
      water.sunDirection.value.copy(sun).normalize()
    }
    updateSun()

    return () => {
      sky.removeFromParent()
      water.removeFromParent()
    }
  }, [scene, gl])

  return (
    <>
      {/* 
        <group scale={0.01}>
            <EnergyWaveCompo></EnergyWaveCompo>
        </group> 
        */}
    </>
  )
}

//
//
//
