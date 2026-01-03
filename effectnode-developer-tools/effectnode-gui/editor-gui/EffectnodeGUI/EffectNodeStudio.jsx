/** @license
 * MIT License
 * @description
 * Copyright 2024-2026+ WONG LOK

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


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
