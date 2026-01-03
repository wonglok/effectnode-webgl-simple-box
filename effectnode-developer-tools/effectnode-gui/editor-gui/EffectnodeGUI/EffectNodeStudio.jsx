import { createContext, useState } from "react";
import { EditorRoot } from "./EditorRoot";
// import { TitleTunnelIn } from "./EditorApp/EditorApp";
// import { usePopStore } from "effectnode-developer-tools/effectnode-runtime/tools/usePopStore";

export const CoreContext = createContext(null);

export function EffectNodeStudio({ projectName = "", children }) {
  const [core, setCore] = useState(null);

  if (process.env.NODE_ENV !== "development") {
    return <>Please use a computer to edit the files</>;
  }

  if (!projectName) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Please Specfiy Project Title
      </div>
    );
  }

  return (
    <>
      <div className="  w-full h-full">
        {
          <CoreContext.Provider value={core}>
            <EditorRoot
              key={projectName + "editor-root"}
              onCoreReady={({ core }) => {
                setCore(core);
              }}
              preview={<>{children}</>}
              title={projectName}
            ></EditorRoot>
          </CoreContext.Provider>
        }
      </div>
    </>
  );
}
