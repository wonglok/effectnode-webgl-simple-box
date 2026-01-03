import { Html } from "@react-three/drei";
import { useEffect } from "react";

export function ToolBox({ useStore, useNodeMemory }) {
  return <>
    {/*  */}

    {/*  */}

    {/*  */}
  </>;
}

export function Runtime({ useNodeMemory, io }) {
  let baseColor = useNodeMemory((r) => r.baseColor);
  useEffect(() => {
    io.output(0, baseColor);
  }, [io, baseColor]);

  return <></>;
}

export function NodeBox({ useNodeMemory }) {
  return (
    <Html position={[0, 0, -1]} center className="bg-white">
      <InputColor useNodeMemory={useNodeMemory}></InputColor>
    </Html>
  );
}

function InputColor({ useNodeMemory }) {
  const baseColor = useNodeMemory((r) => r.baseColor);

  return (
    <input
      type="color"
      value={baseColor}
      onChange={(va) => {
        useNodeMemory.setState({
          baseColor: va.target.value,
        });
      }}
    />
  );
}
