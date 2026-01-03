import { Environment, Html, MeshTransmissionMaterial, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

export function ToolBox({ useStore, useNodeMemory }) {
  let baseColor = useNodeMemory((r) => r.baseColor);
  return <>
    <div className="w-full h-full">
      <Canvas>
        <Sphere scale={2}>
          <MeshTransmissionMaterial transmission={1} roughness={0} thickness={1.75} anisotropy={0.1} chromaticAberration={1} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
        </Sphere>
        <Suspense fallback={null}>
          <Environment files={[`/hdr/default.hdr`]} background></Environment>
        </Suspense>
      </Canvas>
    </div>
  </>;
}

export function Runtime({ useNodeMemory, io }) {
  let baseColor = useNodeMemory((r) => r.baseColor);

  useEffect(() => {
    io.input(0, (v) => {
      useNodeMemory.setState({
        baseColor: v
      })
    })
  }, [io, baseColor]);

  return <>
    <Sphere>
      <MeshTransmissionMaterial transmission={1} roughness={0} thickness={1.75} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
    </Sphere>
  </>;
}

export function NodeBox({ useNodeMemory }) {
  let baseColor = useNodeMemory((r) => r.baseColor);

  return (
    <>
      <Sphere position={[2.5, 0, 0]}>
        <MeshTransmissionMaterial transmission={1} roughness={0} thickness={1.75} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
      </Sphere>
    </>
  );
}

// 
// 
//
//
//
//