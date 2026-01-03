import { Center, Environment, MeshTransmissionMaterial, OrbitControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EnergyWaveCompo } from "./shared/EnergyWave/EnergyWaveCompo";

export function ToolBox({ useNodeMemory }) {
  return <>
    <div className="w-full h-full">
      <Canvas>
        <MyMesh useNodeMemory={useNodeMemory}></MyMesh>

        <PerspectiveCamera position={[0, 0, 3.5]} makeDefault></PerspectiveCamera>

        <Suspense fallback={null}>
          <Environment files={[`/hdr/default.hdr`]} background></Environment>
        </Suspense>

        <OrbitControls></OrbitControls>
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
    <MyMesh useNodeMemory={useNodeMemory}></MyMesh>
  </>;
}

export function NodeBox({ useNodeMemory }) {

  return (
    <>
      <group position={[2.5, 0, 0]}>
        <Center top>
          <MyMesh useNodeMemory={useNodeMemory}></MyMesh>
        </Center>
      </group>
    </>
  );
}

function MyMesh({ useNodeMemory }) {
  let baseColor = useNodeMemory((r) => r.baseColor);

  return <>
    <group scale={0.01}>
      <EnergyWaveCompo></EnergyWaveCompo>
    </group>
    <RoundedBox args={[2, 2, 2]} bevelSegments={5} radius={0.25} position={[0, 0, 0]}>
      <MeshTransmissionMaterial anisotropicBlur={0.12} anisotropy={0.5} chromaticAberration={0.15} transmission={1} roughness={0} thickness={1.75} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
    </RoundedBox>
  </>
}

//
//