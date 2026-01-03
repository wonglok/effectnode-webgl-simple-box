import { Box, Center, Html, PivotControls, Sphere } from "@react-three/drei";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { Matrix4 } from "three";

export function ToolBox({ useAutosaveNodeData }) {
  return <>
    Toolbox
  </>;
}

export function Runtime({ isEditing, useAutosaveNodeData, io, files }) {
  //
  let lightColor = useAutosaveNodeData((r) => r.lightColor) || "#ffffff";
  let intensity = useAutosaveNodeData((r) => r.intensity) || 1;

  //
  return (
    <>
      <MoverGate
        name="light2-plant"
        isEditing={isEditing}
        useAutosaveNodeData={useAutosaveNodeData}
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
        useAutosaveNodeData={useAutosaveNodeData}
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

      {/*   */}
    </>
  );
}

function MoverGate({ isEditing, name = "light1", useAutosaveNodeData, children }) {
  let moveData =
    useAutosaveNodeData((r) => r[name]) || new Matrix4().identity().toArray();

  let gizmo = useAutosaveNodeData((r) => r.gizmo) || false;
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
        useAutosaveNodeData.setState({
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
            useAutosaveNodeData.setState({
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

export function NodeBox({ useAutosaveNodeData }) {
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
            <GizmoMove useAutosaveNodeData={useAutosaveNodeData}></GizmoMove>
            <InputRange
              name={`intensity`}
              max={500}
              useAutosaveNodeData={useAutosaveNodeData}
            ></InputRange>
            <InputColor
              name={`lightColor`}
              useAutosaveNodeData={useAutosaveNodeData}
            ></InputColor>
          </div>
        </Html>
      </Center>
    </group>
  );
}

function GizmoMove({ useAutosaveNodeData }) {
  let name = "gizmo";
  let value = useAutosaveNodeData((r) => r[name]);
  return (
    <div>
      {" Gismo: "}
      <input
        type="checkbox"
        checked={value}
        onChange={() => {
          useAutosaveNodeData.setState({
            [name]: !value,
          });
        }}
      ></input>
    </div>
  );
}

function InputColor({ name, useAutosaveNodeData }) {
  let value = useAutosaveNodeData((r) => r[name]);

  return (
    <input
      className=""
      type="color"
      value={value}
      onChange={(va) => {
        useAutosaveNodeData.setState({
          [name]: va.target.value,
        });
      }}
    />
  );
}

function InputRange({ name, step = 0.1, min = 0, max = 20, useAutosaveNodeData }) {
  let value = useAutosaveNodeData((r) => r[name]);

  return (
    <input
      className=""
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(va) => {
        useAutosaveNodeData.setState({
          [name]: va.target.value,
        });
      }}
    />
  );
}
