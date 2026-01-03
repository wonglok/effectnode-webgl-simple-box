import { Html } from "@react-three/drei";
import { useEffect } from "react";

export function ToolBox({ useStore, useAutoSaveData }) {
  return <>
    {/*  */}

    {/*  */}

    {/*  */}
  </>;
}

export function Runtime({ useAutoSaveData, io }) {
  let baseColor = useAutoSaveData((r) => r.baseColor);
  useEffect(() => {
    io.output(0, baseColor);
  }, [io, baseColor]);

  return <></>;
}

export function NodeBox({ useAutoSaveData }) {
  return (
    <Html position={[0, 0, -1]} center className="bg-white">
      <InputColor useAutoSaveData={useAutoSaveData}></InputColor>
    </Html>
  );
}

function InputColor({ useAutoSaveData }) {
  const baseColor = useAutoSaveData((r) => r.baseColor);

  return (
    <input
      type="color"
      value={baseColor}
      onChange={(va) => {
        useAutoSaveData.setState({
          baseColor: va.target.value,
        });
      }}
    />
  );
}
