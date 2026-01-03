import { Environment, Html, MeshTransmissionMaterial, PerspectiveCamera, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

export function ToolBox({ useNodeMemory }) {
  return <>
    <div className="w-full h-full">
      <Canvas>

        <MySphere useNodeMemory={useNodeMemory}></MySphere>

        <PerspectiveCamera position={[0, 0, 3]} makeDefault></PerspectiveCamera>

        <Suspense fallback={null}>
          <Environment files={[`/hdr/default.hdr`]} background></Environment>
        </Suspense>
      </Canvas>
    </div>
  </>;
}

export function Runtime({ useNodeMemory, io }) {
  useEffect(() => {
    io.input(0, (v) => {
      useNodeMemory.setState({
        baseColor: v
      })
    })
  }, [io]);

  return <>
    <MySphere useNodeMemory={useNodeMemory}></MySphere>
  </>;
}

export function NodeBox({ useNodeMemory }) {

  return (
    <>
      <group position={[2.5, 0, 0]}>
        <MySphere useNodeMemory={useNodeMemory}></MySphere>
      </group>
    </>
  );
}

function MySphere({ useNodeMemory }) {
  let baseColor = useNodeMemory((r) => r.baseColor);

  return <>
    <Sphere position={[0, 0, 0]}>
      <MeshTransmissionMaterial transmission={1} roughness={0} thickness={1.75} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
    </Sphere>
  </>
}

//