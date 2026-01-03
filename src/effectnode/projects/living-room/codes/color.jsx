import { Html } from "@react-three/drei";
import { useEffect } from "react";

export function ToolBox({ useStore, useAutosaveNodeData }) {
  return <>
    {/*  */}

    {/*  */}

    {/*  */}
  </>;
}

export function Runtime({ useAutosaveNodeData, io }) {
  let baseColor = useAutosaveNodeData((r) => r.baseColor);
  useEffect(() => {
    io.output(0, baseColor);
  }, [io, baseColor]);

  return <></>;
}

export function NodeBox({ useAutosaveNodeData }) {
  return (
    <Html position={[0, 0, -1]} center className="bg-white">
      <InputColor useAutosaveNodeData={useAutosaveNodeData}></InputColor>
    </Html>
  );
}

function InputColor({ useAutosaveNodeData }) {
  const baseColor = useAutosaveNodeData((r) => r.baseColor);

  return (
    <input
      type="color"
      value={baseColor}
      onChange={(va) => {
        useAutosaveNodeData.setState({
          baseColor: va.target.value,
        });
      }}
    />
  );
}
