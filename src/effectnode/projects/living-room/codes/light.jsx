import { Box, Center, Environment, Html, PivotControls, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Quaternion, Vector3 } from "three";
import { Matrix4 } from "three";
import { RoomContent } from "./shared/RoomContent";

export function ToolBox({ io, isEditing, useNodeMemory }) {
  let [state, setState] = useState(null)

  useEffect(() => {
    io.input(0, (value) => {
      console.log(value)
      //
      setState(value)
    })
  }, [])

  return <>
    <Canvas>
      {state}
      <Content isEditing={true} useNodeMemory={useNodeMemory}></Content>
      <Suspense fallback={null}>
        <RoomContent></RoomContent>
        <Environment files={[`/hdr/default.hdr`]}></Environment>
      </Suspense>
    </Canvas>
  </>;
}

export function Runtime({ isEditing, useNodeMemory, io, files }) {
  //
  //
  return (
    <>
      <Content isEditing={false} useNodeMemory={useNodeMemory}></Content>
    </>
  );
}

function Content({ isEditing, useNodeMemory }) {
  //
  let lightColor = useNodeMemory((r) => r.lightColor) || "#ffffff";
  let intensity = useNodeMemory((r) => r.intensity) || 1;

  return <>
    <MoverGate
      name="light2-plant"
      isEditing={isEditing}
      useNodeMemory={useNodeMemory}
    >
      <pointLight
        castShadow
        shadow-bias={-0.0002}
        color={lightColor}
        intensity={intensity}
      ></pointLight>
    </MoverGate>

    <MoverGate
      name="light-lamp-2"
      isEditing={isEditing}
      useNodeMemory={useNodeMemory}
    >
      <pointLight
        castShadow
        shadow-bias={-0.0002}
        color={lightColor}
        intensity={intensity}
      ></pointLight>
    </MoverGate>

    <group>
      <pointLight
        intensity={intensity}
        color={lightColor}
        position={[22.0973094478636, -5.32978595305698, -20.045753251723227]}
      ></pointLight>
    </group>
  </>

}

function MoverGate({ isEditing, name = "light1", useNodeMemory, children }) {
  let moveData =
    useNodeMemory((r) => r[name]) || new Matrix4().identity().toArray();

  let gizmo = useNodeMemory((r) => r.gizmo) || false;
  let { m4, position, scale, quaternion } = useMemo(() => {
    let m4 = new Matrix4().fromArray(moveData);

    let position = new Vector3(0, 0, 0);
    let quaternion = new Quaternion().identity();
    let scale = new Vector3(0, 0, 0);
    m4.decompose(position, quaternion, scale);

    return {
      m4,
      position: position.toArray(),
      scale: scale.toArray(),
      quaternion: quaternion.toArray(),
    };
  }, [moveData]);

  return isEditing &&
    moveData &&
    gizmo &&
    process.env.NODE_ENV === "development" ? (
    <PivotControls
      matrix={m4}
      scale={10}
      onDrag={(ev) => {
        useNodeMemory.setState({
          [name]: ev.toArray(),
        });
      }}
    >
      <group scale={scale}>{children}</group>
      <Html center transform position={[0, 15, 0]} scale={2}>
        <button className="bg-white px-3 py-1">{name}</button>
      </Html>
      <Html center transform position={[20, 0, 0]} scale={2}>
        <button
          className="bg-white px-3 py-1"
          onClick={() => {
            let ev = new Matrix4().identity();
            ev.copyPosition(m4);
            useNodeMemory.setState({
              [name]: ev.toArray(),
            });
          }}
        >
          Reset Pivot
        </button>
      </Html>
    </PivotControls>
  ) : (
    <group position={position} scale={scale} quaternion={quaternion}>
      {children}
    </group>
  );
}

export function NodeBox({ useNodeMemory }) {
  return (
    <group rotation={[0, 0, 0]}>
      <Center>
        <Html
          distanceFactor={5}
          position={[1.25, 0.0, -0.35]}
          className=" z-50"
        >
          <div
            onMouseDownCapture={(e) => {
              e.stopPropagation();
            }}
            onMouseMoveCapture={(e) => {
              e.stopPropagation();
            }}
            onPointerDownCapture={(e) => {
              e.stopPropagation();
            }}
            onPointerMoveCapture={(e) => {
              e.stopPropagation();
            }}
            className="w-full h-full"
          >
            <GizmoMove useNodeMemory={useNodeMemory}></GizmoMove>
            <InputRange
              name={`intensity`}
              max={500}
              useNodeMemory={useNodeMemory}
            ></InputRange>
            <InputColor
              name={`lightColor`}
              useNodeMemory={useNodeMemory}
            ></InputColor>
          </div>
        </Html>
      </Center>
    </group>
  );
}

function GizmoMove({ useNodeMemory }) {
  let name = "gizmo";
  let value = useNodeMemory((r) => r[name]);
  return (
    <div>
      {" Gismo: "}
      <input
        type="checkbox"
        checked={value}
        onChange={() => {
          useNodeMemory.setState({
            [name]: !value,
          });
        }}
      ></input>
    </div>
  );
}

function InputColor({ name, useNodeMemory }) {
  let value = useNodeMemory((r) => r[name]);

  return (
    <input
      className=""
      type="color"
      value={value}
      onChange={(va) => {
        useNodeMemory.setState({
          [name]: va.target.value,
        });
      }}
    />
  );
}

function InputRange({ name, step = 0.1, min = 0, max = 20, useNodeMemory }) {
  let value = useNodeMemory((r) => r[name]);

  return (
    <input
      className=""
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(va) => {
        useNodeMemory.setState({
          [name]: va.target.value,
        });
      }}
    />
  );
}
