// import { Box, PerspectiveCamera } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
import {
  Environment,
  // Environment,
  // Gltf,
  // PivotControls,
  // TransformControls,
  useGLTF,
  // OrbitControls,
  // PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, } from "react";

// import { Clock } from "three";

import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export function ToolBox({ useNodeMemory, files }) {
  let baseColor = useNodeMemory((r) => r.baseColor);

  useEffect(() => {
    io.output(0, <Suspense fallback={null}>
      <Content files={files}></Content>
    </Suspense>)
  }, [])

  return <>
    <div className="w-full h-full">
      <Canvas>
        <Suspense fallback={null}>
          <Content files={files}></Content>
          <Environment files={[`/hdr/default.hdr`]} background></Environment>
        </Suspense>
      </Canvas>
    </div>
  </>;
}

export function Runtime({ io, files, onLoop }) {


  return (
    <>
      <Content files={files}></Content>
    </>
  );
}

function Content({ files }) {
  let gltf = useGLTF(files["/env/interior.glb"]);

  let cloned = clone(gltf.scene);

  useEffect(() => {
    cloned.traverse((it) => {
      if (it.isMesh) {
        it.castShadow = true;
        it.receiveShadow = true;
      }
    });
  }, [cloned]);

  return <group
    onClick={(ev) => {
      console.log("clicked", ev.point.toArray(), ev.object.name);
    }}
  >
    <primitive object={cloned}></primitive>
  </group>
}