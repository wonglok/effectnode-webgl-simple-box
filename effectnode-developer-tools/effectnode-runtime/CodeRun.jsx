// import md5 from "md5";
import { useCallback, useEffect, useMemo, useState } from "react";
import { create } from "zustand";
// import { getID } from "./tools/getID";
// import { create } from "zustand";
// import md5 from "md5";

const BoxDataMap = new Map();

export function CodeRun({
  projectName,
  Algorithm = () => null,
  useRuntime,
  nodeID,
  domElement,
  socketMap,
  // onLoop,
  useEditorStore,
  mode,
  // useAutosaveNodeData,
}) {
  let graph = useRuntime((r) => r.graph) || {};
  let nodes = graph.nodes;
  let edges = graph.edges;
  let nodeOne = nodes?.find((r) => r._id === nodeID);

  //
  let files = useRuntime((r) => r.files);
  let settings = useRuntime((r) => r.settings);

  let setting = settings.find((r) => r.nodeID === nodeID);


  let useAutosaveNodeData = useMemo(() => {
    let make = () => {
      return create((set, get) => {
        //
        return {
          //
        };
        //
      });
    };

    if (BoxDataMap.has(projectName + nodeID)) {
      return BoxDataMap.get(projectName + nodeID);
    }
    BoxDataMap.set(projectName + nodeID, make());
    return BoxDataMap.get(projectName + nodeID);
  }, [projectName, nodeID]);


  //

  let [{ onLoop }, setAPI] = useState({
    onLoop: () => { },
  });

  useEffect(() => {
    let api = {
      tsk: [],
      onLoop: (v) => {
        api.tsk.push(v);

        return () => {
          api.tsk = api.tsk.filter((r) => r !== v);
        };
      },
    };

    setAPI(api);

    let rAFID = 0;
    let rAF = async () => {
      for (let t of api.tsk) {
        await t();
      }
      rAFID = requestAnimationFrame(rAF);
    };
    rAFID = requestAnimationFrame(rAF);

    return () => {
      cancelAnimationFrame(rAFID);
    };
  }, []);

  let [{ onClean, cleanAll }] = useState(() => {
    let api = {
      cleans: [],
      onClean: (v) => {
        api.cleans.push(v);
      },
      cleanAll: () => {
        api.cleans.forEach((t) => t());
        api.cleans = [];
      },
    };

    return api;
  });

  useEffect(() => {
    return () => {
      cleanAll();
    };
  }, [cleanAll]);

  let [io, setIO] = useState(false);
  useEffect(() => {
    let cleans = [];

    let ioPXY = new Proxy(
      {
        // edgesLength: edges?.length,
        //
      },
      {
        get: (obj, key) => {
          if (typeof key === 'symbol') {
            // console.log(key.toString())
            return () => {
            }
          }
          if (key.startsWith("out")) {
            return (idx, val) => {
              // let idx = Number(key.replace("out", ""));

              let node = nodeOne;
              let output = node.outputs[idx];

              let edges = useRuntime?.getState()?.graph?.edges || [];

              let destEdges = edges.filter((r) => r.output._id === output._id);
              destEdges.forEach((edge) => {
                socketMap.setState({
                  [edge.input._id]: val,
                });
              });
            };
          }

          if (key.startsWith("in")) {
            return (idx, handler = () => { }) => {
              return new Promise((resolve) => {
                //
                // let idx = Number(key.replace("in", ""));
                //

                let node = nodeOne;
                let input = node.inputs[idx];

                let clean = socketMap.subscribe((state, before) => {
                  if (
                    typeof state[input._id] !== "undefined" &&
                    state[input._id] !== before[input._id]
                  ) {
                    handler(state[input._id]);
                  }
                });

                let tt = setInterval(() => {
                  let val = socketMap.getState()[input._id];
                  if (typeof val !== "undefined") {
                    handler(val);
                    resolve(val);
                    clearInterval(tt);
                  }
                });

                cleans.push(clean);
              });
            };
          }
        },
        //
        //
      }
    );

    setIO(ioPXY);

    return () => { };
  }, [domElement, nodeOne, socketMap, useRuntime, edges?.length]);

  let extendAPI = useMemo(() => {
    let eAPI = {
      get boxData() {
        if (mode === "toolbox" || mode === "node") {
          let diskSettings = useEditorStore.getState().settings;
          let diskSetting = diskSettings.find((r) => r.nodeID === nodeID);

          diskSetting.metaData = diskSetting.metaData || {};

          return diskSetting.metaData;
        }
        if (mode === "runtime") {
          let runtimeSettings = useRuntime.getState().settings;
          let runtimeSetting = runtimeSettings.find((r) => r.nodeID === nodeID);

          runtimeSetting.metaData = runtimeSetting.metaData || {};

          return runtimeSetting.metaData;
        }
      },

      tt: 0,
      saveBoxData: () => {
        if (
          mode === "toolbox" ||
          mode === "node" ||
          (mode === "runtime" && useEditorStore)
        ) {
          console.log("[OK] Saving in Toolbox Phase");
          let diskSettings = useEditorStore.getState().settings;
          let diskSetting = diskSettings.find((r) => r.nodeID === nodeID);

          clearTimeout(eAPI.tt);
          eAPI.tt = setTimeout(() => {
            useEditorStore.setState({
              settings: diskSettings.map((r) => {
                if (r.nodeID === nodeID) {
                  return diskSetting;
                }
                return r;
              }),
            });
          }, 300);
        }

        if (mode === "runtime" && !useEditorStore) {
          console.log("missing useEditorStore");
        }
        // if (mode === "runtime") {
        //   if (process.env.NODE_ENV === "development") {
        //     console.log("cant saveBoxData in runtime");
        //   }
        // }
      },
    };

    return eAPI;
  }, [mode, nodeID, useEditorStore]);

  useEffect(() => {
    useAutosaveNodeData.setState({ ...extendAPI.boxData });
  }, [extendAPI, useAutosaveNodeData]);

  useEffect(() => {
    //

    let timer = 0;

    return useAutosaveNodeData.subscribe((now, b4) => {
      for (let each in now) {
        extendAPI.boxData[each] = now[each];
      }

      extendAPI.saveBoxData();
    });
  }, [useAutosaveNodeData, mode, nodeID, useEditorStore, extendAPI]);

  return (
    <>
      {setting && io && socketMap && (
        <Algorithm
          //
          projectName={projectName}
          files={files}
          nodeID={nodeID}
          onLoop={onLoop}
          onClean={onClean}
          useRuntime={useRuntime}
          domElement={domElement}
          //
          isEditing={useEditorStore}
          useAutosaveNodeData={useAutosaveNodeData}
          io={io}
        //
        ></Algorithm>
      )}
    </>
  );
}
