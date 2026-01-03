// import { Box, PerspectiveCamera } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
import {
  Environment,
  // Environment,
  // Gltf,
  // PivotControls,
  // TransformControls,
  // useGLTF,
  // OrbitControls,
  // PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, } from "react";

import { RoomContent } from './shared/RoomContent'

export function ToolBox({ io, useNodeMemory, files }) {
  return <>
    <div className="w-full h-full">
      <Canvas>
        <Suspense fallback={null}>

          <RoomContent files={files}></RoomContent>

          <Environment files={[`/hdr/default.hdr`]} background></Environment>
        </Suspense>
      </Canvas>
    </div>
  </>;
}

export function Runtime({ io, files, onLoop }) {

  return (
    <>
      <RoomContent files={files}></RoomContent>
    </>
  );
}

// 