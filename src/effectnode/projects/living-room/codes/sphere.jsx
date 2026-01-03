import { Html, MeshTransmissionMaterial, Sphere } from "@react-three/drei";
import { useEffect, useState } from "react";

export function ToolBox({ useStore, useAutosaveNodeData }) {
  let baseColor = useAutosaveNodeData((r) => r.baseColor);
  return <>
    <div>{baseColor}</div>
  </>;
}

export function Runtime({ useAutosaveNodeData, io }) {
  let baseColor = useAutosaveNodeData((r) => r.baseColor);

  useEffect(() => {
    io.input(0, (v) => {
      useAutosaveNodeData.setState({
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

export function NodeBox({ useAutosaveNodeData }) {
  let baseColor = useAutosaveNodeData((r) => r.baseColor);

  return (
    <>
      <Sphere position={[2.5, 0, 0]}>
        <MeshTransmissionMaterial transmission={1} roughness={0} thickness={1.75} color={baseColor} metalness={0} ></MeshTransmissionMaterial>
      </Sphere>
    </>
  );
}
