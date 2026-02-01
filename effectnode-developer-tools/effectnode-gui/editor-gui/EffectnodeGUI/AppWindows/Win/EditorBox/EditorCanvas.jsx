import { getID } from "effectnode-developer-tools/effectnode-gui/editor-gui/EffectnodeGUI/utils/getID";
import { myWins } from "effectnode-developer-tools/effectnode-gui/editor-gui/EffectnodeGUI/utils/myApps";
import {
  Box,
  Center,
  Grid,
  Html,
  MapControls,
  PerspectiveCamera,
  RoundedBox,
  Text3D,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
// import hdr from "public/hdr/studiolighting.hdr";
import { useEffect } from "react";
import { SocketInputs, SocketOutputs } from "./Sockets/Sockets";
import { DisplayCreateEdge } from "./Edge/DisplayCreateEdge";
import { DisplayAllEdges } from "./Edge/DisplayAllEdges";
import { useDeveloper } from "effectnode-developer-tools/effectnode-gui/store/useDeveloper";
import { GUI } from "./GUI";
import { CanvasGPU } from "@/components/CanvasGPU/CanvasGPU";
import { EnvLoader } from "@/components/CanvasGPU/EnvLoader";
import { font } from "./Sockets/font.helvetica";

//

function InstallToStore({ useStore }) {
  let camera = useThree((r) => r.camera);
  useEffect(() => {
    useStore.setState({
      //
      _editor_camera: camera,
    });
  }, [camera, useStore]);

  let scene = useThree((r) => r.scene);
  useEffect(() => {
    useStore.setState({
      //
      _editor_scene: scene,
    });
  }, [scene, useStore]);

  let raycaster = useThree((r) => r.raycaster);
  useEffect(() => {
    useStore.setState({
      //
      _editor_raycaster: raycaster,
    });
  }, [raycaster, useStore]);

  let mouse = useThree((r) => r.mouse);
  useEffect(() => {
    useStore.setState({
      //
      mouse: mouse,
    });
  }, [mouse, useStore]);

  let pointer = useThree((r) => r.pointer);
  useEffect(() => {
    useStore.setState({
      //
      pointer: pointer,
    });
  }, [pointer, useStore]);
  return null;
}

function Content({ useStore }) {
  let wins = useStore((r) => r.wins);
  let editorAPI = useStore((r) => r.editorAPI);
  let graph = useStore((r) => r.graph);
  let nodes = graph.nodes || [];
  let edges = graph.edges || [];
  let graphCursorState = useStore((r) => r.graphCursorState);
  let controls = useThree((r) => r.controls);
  let scene = useThree((r) => r.scene);
  //
  //
  let spaceID = useStore((r) => r.spaceID);

  return (
    <>
      <Box
        name="floor"
        //
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        //
        onPointerLeave={() => {
          document.body.style.cursor = "";
        }}
        onPointerUp={({ point }) => {
          if (graphCursorState.isDown) {
            graphCursorState.isDown = false;
            controls.enabled = true;
            graphCursorState.func = "";

            useStore.setState({
              graphCursorState: {
                ...graphCursorState,
              },
            });
          }
        }}
        onPointerMove={({ point }) => {
          //
          if (graphCursorState.isDown) {
            if (graphCursorState.func === "moveNode") {
              //
              graphCursorState.now.copy(point);
              graphCursorState.delta.copy(point).sub(graphCursorState.last);
              graphCursorState.last.copy(point);
              graphCursorState.delta.y = 0;
              graphCursorState.accu.add(graphCursorState.delta);

              let objectGroup = scene.getObjectByName(graphCursorState.nodeID);
              if (objectGroup) {
                graphCursorState.delta.y = 0;
                objectGroup.position.add(graphCursorState.delta);
                let node = nodes.find((r) => r._id === graphCursorState.nodeID);
                node.position = objectGroup.position.toArray();
              }
            }

            // reload for curves
            if (graphCursorState.func === "moveNode") {
              useStore.setState({
                graph: {
                  ...graph,
                },
              });
            }

            //
          }
        }}
        //
        args={[100000000000000000, 0.15, 100000000000000000]}
        position={[0, -0.15, 0]}
      >
        <meshBasicMaterial visible={false}></meshBasicMaterial>
      </Box>

      {nodes.map((n) => {
        // console.log(n.position);
        return (
          <group
            name={n._id}
            userData={{
              type: "nodeGroup",
            }}
            position={n.position}
            key={n._id}
          >
            <RoundedBox
              //
              onPointerUp={({ point }) => {
                //

                //

                let time = performance.now();
                let diff = time - graphCursorState.timer;
                //
                let dist = graphCursorState.ts.distanceTo(point);

                let offsetWindow = ({ win }) => {
                  let sizeWidth = window.innerWidth / 2 + 20;
                  win.left = sizeWidth;
                  win.top = 10;
                  //
                  win.height = (window.innerHeight - 130) / 2 - 20;
                  // win.height = window.innerHeight - 130 - 20;
                  win.width = window.innerWidth - sizeWidth - 10;

                  //
                };
                if (diff <= 250 && dist <= 1) {
                  //

                  if (!wins.some((r) => r.appID === n._id)) {
                    let win = JSON.parse(
                      JSON.stringify(myWins.find((r) => r.type === "coder"))
                    );
                    win._id = getID();
                    win.appID = n._id;
                    win.nodeID = n._id;
                    win.title = "🧑🏼‍💻 " + n.title;
                    wins.push(win);

                    editorAPI.upWindow({ win });

                    offsetWindow({ win });

                    useStore.setState({
                      wins: [...wins],
                    });
                  } else {
                    let win = wins.find((r) => r.appID === n._id);
                    //
                    win.title = "🧑🏼‍💻 " + n.title;
                    win.nodeID = n._id;
                    editorAPI.upWindow({ win });

                    offsetWindow({ win });

                    useStore.setState({
                      wins: [...wins],
                    });
                    //
                  }

                  //
                  useDeveloper.getState().openEditor({
                    title: spaceID,
                    nodeTitle: n.title,
                  });

                  //
                  //
                  //
                }
              }}
              onPointerDown={({ point }) => {
                //
                graphCursorState.nodeID = n._id;
                graphCursorState.isDown = true;
                graphCursorState.func = "moveNode";
                graphCursorState.ts.copy(point);
                graphCursorState.now.copy(point);
                graphCursorState.last.copy(point);
                graphCursorState.timer = performance.now();
                controls.enabled = false;
                graphCursorState.accu.set(0, 0, 0);

                //
                useStore.setState({
                  graphCursorState: {
                    ...graphCursorState,
                  },
                });
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              userData={{
                type: "box",
              }}
              onPointerEnter={() => {
                document.body.style.cursor = "pointer";
              }}
              //
              onPointerLeave={() => {
                document.body.style.cursor = "";
              }}
              //
              position={[0, 0.3 / 2, 0]}
              //
              args={[2, 0.3, 0.5]}
              //
              scale={[1, 0.3, 1]}
              //
              radius={0.3 / 2}
            >
              <meshStandardMaterial
                roughness={0.2}
                metalness={0.8}
                color={"#ffffff"}
              ></meshStandardMaterial>
            </RoundedBox>

            <GUI useStore={useStore} node={n}></GUI>

            <SocketInputs useStore={useStore} node={n}></SocketInputs>
            <SocketOutputs useStore={useStore} node={n}></SocketOutputs>


            <Center top position={[0, 0.5, 0]}>
              <Text3D
                font={font}
                position={[0, 0.0, 0]}
                scale={[0.2, 0.2, 0.2]}
                color={"black"}
                rotation={[Math.PI * -0.5, 0, 0]}
              >
                {n.title}
                <meshBasicMaterial color={'#060023'}></meshBasicMaterial>
              </Text3D>
            </Center>

            {/* <Html
              transform
              userData={{
                type: "text",
              }}
              scale={0.5}
              position={[0, 0, -0.5]}
              rotation={[Math.PI * -0.25, 0, 0]}
              outlineWidth={0.005}
              outlineColor={"white"}
              color={"black"}
              textAlign="center"
            >
              {n.title}
            </Html> */}
          </group>
        );
      })}

      {graphCursorState.func === "createEdge" && (
        <>
          <DisplayCreateEdge useStore={useStore}></DisplayCreateEdge>
        </>
      )}

      <group>
        <DisplayAllEdges useStore={useStore}></DisplayAllEdges>
      </group>
    </>
  );
}

export function EditorCanvas({ useStore }) {
  let zoom = 3;
  let hdr = `/hdr/default.hdr`
  //
  return (
    <>
      <div
        //
        className="w-full h-full"
        //
        onPointerLeave={() => {
          let st = useStore.getState().graphCursorState;
          st.isDown = false;

          if (st.controls) {
            st.controls.enabled = true;
          }

          useStore.setState({
            graphCursorState: {
              ...st,
            },
          });
        }}
      //
      >
        {/*  */}
        <CanvasGPU webgl>
          {/*  */}

          <gridHelper
            args={[1000, 1000, 0xffffff, 0xffffff]}
          ></gridHelper>

          <InstallToStore useStore={useStore}></InstallToStore>

          <Content useStore={useStore}></Content>

          {/* <Environment background files={[hdr]}></Environment> */}
          <EnvLoader background url={hdr}></EnvLoader>

          <MapControls
            makeDefault
            object-fov={90}
            object-position={[0, 3.5 * zoom, 1.0 * zoom]}
            target={[0, 0, 0]}
          ></MapControls>
        </CanvasGPU>
      </div>
    </>
  );
}

export function Editor() {
  return (
    <>
      <EditorCanvas></EditorCanvas>
    </>
  );
}

//
