// import { Box, PerspectiveCamera } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
import {} from // Environment,
// Gltf,
// PivotControls,
// TransformControls,
// useGLTF,
// OrbitControls,
// PerspectiveCamera,
'@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import { RoomContent } from './shared/RoomContent'
import { CanvasGPU } from '@/components/CanvasGPU/CanvasGPU'
import { EnvLoader } from '@/components/CanvasGPU/EnvLoader'

export function ToolBox({ io, useNodeMemory, files }: any) {
  return (
    <>
      <div className='w-full h-full'>
        <CanvasGPU>
          <Suspense fallback={null}>
            <RoomContent files={files}></RoomContent>
            <EnvLoader url={`/hdr/default.hdr`}></EnvLoader>
            {/* <Environment files={[`/hdr/default.hdr`]} background></Environment> */}
          </Suspense>
        </CanvasGPU>
      </div>
    </>
  )
}

export function Runtime({ io, files, onLoop }) {
  return (
    <>
      <RoomContent files={files}></RoomContent>
    </>
  )
}

//
