import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { create } from "zustand";
import { Emit } from "./Emit";
import { getSignature } from "./tools/getSignature";
import { usePopStore } from "./tools/usePopStore";
import { CodeRun } from "./CodeRun";
import { CoreContext } from "effectnode-developer-tools/effectnode-gui/editor-gui/EffectnodeGUI/EffectNodeStudio";

const RunTimeStoreMap = new Map();
const BoxDataMap = new Map();

export function EffectNode({
  projectName,

  mode = "runtime",
  nodeID = false,
  useEditorStore = false,
}) {
  //
  const core = useContext(CoreContext);
  if (core && core.store && !useEditorStore) {
    useEditorStore = core.store;
  }

  if (useEditorStore) {
    let store = useEditorStore.getState();
    if (store.spaceID !== projectName) {
      useEditorStore = false;
    }
  }

  let useAutoSaveData = useMemo(() => {
    let make = () => {
      return create((set, get) => {
        //
        return {};
        //
      });
    };

    if (BoxDataMap.has(projectName)) {
      return BoxDataMap.get(projectName);
    }
    BoxDataMap.set(projectName, make());
    return BoxDataMap.get(projectName);
  }, [projectName]);

  // let [api, setDisplay] = useState({ domElement: false });

  let useRuntime = useMemo(() => {
    let make = () => {
      return create((set, get) => {
        //
        return {
          socketMap: create(() => ({})),

          codes: false,
          settings: [],

          projectName: projectName,
          files: false,
          graph: false,
        };
        //
      });
    };

    if (RunTimeStoreMap.has(projectName)) {
      return RunTimeStoreMap.get(projectName);
    }
    RunTimeStoreMap.set(projectName, make());
    return RunTimeStoreMap.get(projectName);
  }, [projectName]);

  // let files = useRuntime((r) => r.files);
  let socketMap = useRuntime((r) => r.socketMap);
  let codes = useRuntime((r) => r.codes) || [];
  let graph = useRuntime((r) => r.graph);
  let edges = graph.edges || [];
  let nodes = graph.nodes || [];
  let node = nodes.find((r) => r._id === nodeID);
  let codeImple = codes.find((r) => r.codeName === node?.title);

  useEffect(() => {
    if (!useRuntime) {
      return;
    }
    if (!useEditorStore) {
      return;
    }

    let last = "";
    return useEditorStore.subscribe((state, before) => {
      let now = JSON.stringify({
        settings: state.settings,
      });
      if (now !== last) {
        last = now;
        useRuntime.setState({
          settings: JSON.parse(JSON.stringify(state.settings)),
        });
      }
    });
  }, [useRuntime, useEditorStore]);

  // Graph Editor
  useEffect(() => {
    if (!useRuntime) {
      return;
    }
    if (!useEditorStore) {
      return;
    }

    let last = "";
    return useEditorStore.subscribe((state, before) => {
      let now = JSON.stringify({
        graph: {
          nodes: state.graph.nodes.map((r) => {
            return {
              ...r,
              position: [0, 0, 0],
            };
          }),
          edges: state.graph.edges,
        },
      });
      if (now !== last) {
        last = now;
        useRuntime.setState({
          socketMap: create(() => {
            return {};
          }),
          graph: JSON.parse(JSON.stringify(state.graph)),
        });
      }
    });
  }, [useRuntime, useEditorStore]);

  // let randID = useMemo(() => {
  //   return `_${md5(projectName)}${mode}${nodeID || ""}`;
  // }, [projectName, mode, nodeID]);

  // useEffect(() => {
  //   let tt = setInterval(() => {
  //     //
  //     let domElement = document.querySelector(`#${randID}`);
  //     //
  //     if (domElement) {
  //       //
  //       clearInterval(tt);
  //       //
  //       setDisplay({
  //         domElement,
  //       });
  //     }
  //   }, 0);

  //   return () => {
  //     clearInterval(tt);
  //   };
  // }, [randID]);

  let onData = useCallback(
    async (data) => {
      //
      let projects = data.projects;
      let project = projects.find((r) => r.projectName === projectName);

      if (project) {
        let files = new Proxy({}, {
          get: (o, props) => {
            if (typeof props === 'symbol') {
              return ``
            }

            return `/projects/${projectName}/${props}`
          }
        });
        // project.assets.forEach((ac) => {
        //   files[ac._id.split("/assets")[1]] = ac.assetURL;
        // });

        if (useEditorStore) {
          useRuntime.setState({
            files: files,
            project: project,
            codes: project.codes,
          });
        } else {
          useRuntime.setState({
            socketMap: create(() => {
              return {};
            }),
            files: files,
            project: project,
            codes: project.codes,
            settings: project.settings,
            graph: project.graph,
          });
        }
      }
    },

    [projectName, useRuntime, useEditorStore]
  );

  let projects = usePopStore((s) => s.projects);

  useEffect(() => {
    onData({ projects: usePopStore.getState().projects });

    return usePopStore.subscribe(async (now, b4) => {
      let nowSig = await getSignature(now.projects);
      let b4Sig = await getSignature(b4.projects);
      if (nowSig.text !== b4Sig.text) {
        onData({ projects: projects });
      }
    });
  }, [onData, projects]);

  //

  return (
    <>
      {socketMap && useRuntime && (
        // <div id={randID} className="w-full h-full overflow-hidden relative">
        <>
          {mode === "runtime" &&
            // api.domElement &&
            nodes
              .filter((node) => {
                return codes.some((code) => node.title === code.codeName);
              })
              .map((node) => {
                let codeImple = codes.find((r) => r.codeName === node.title);

                return (
                  <CodeRun
                    useAutoSaveData={useAutoSaveData}
                    projectName={projectName}
                    mode={"runtime"}
                    key={node?._id + codeImple?._id}
                    nodeID={node._id}
                    socketMap={socketMap}
                    useRuntime={useRuntime}
                    Algorithm={codeImple?.mod?.Runtime}
                    useEditorStore={useEditorStore}
                  ></CodeRun>
                );
              })}

          {mode === "toolbox" && nodeID && (
            <CodeRun
              useAutoSaveData={useAutoSaveData}
              projectName={projectName}
              mode={"toolbox"}
              key={nodeID + codeImple?._id}
              nodeID={nodeID}
              socketMap={socketMap}
              useRuntime={useRuntime}
              Algorithm={codeImple?.mod?.ToolBox}
              useEditorStore={useEditorStore}
            ></CodeRun>
          )}

          {mode === "node" && nodeID && (
            <CodeRun
              useAutoSaveData={useAutoSaveData}
              projectName={projectName}
              mode={"node"}
              key={nodeID + codeImple?._id}
              nodeID={nodeID}
              socketMap={socketMap}
              useRuntime={useRuntime}
              Algorithm={codeImple?.mod?.NodeBox}
              useEditorStore={useEditorStore}
            ></CodeRun>
          )}
        </>
      )}

      <Emit projectName={projectName}></Emit>

      {/*  */}

      {/*  */}
    </>
  );
}
