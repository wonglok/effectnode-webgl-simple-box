import { Code } from "./Win/Code/Code";
import { EditorBox } from "./Win/EditorBox/EditorBox";
import { WinGeneric } from "./Win/Generic/WinGeneric";
import { Previewer } from "./Win/Previewer/Previewer";
import { Previewer2 } from "./Win/Previewer2/Previewer2";

export function AppWindows({ useStore }) {
  // let apps = useStore((r) => r.apps)
  let wins = useStore((r) => r.wins);

  return (
    <>
      {wins.map((win, idx) => {
        return (
          <WinGeneric
            enableCover={win.type === "previewer"}
            idx={idx}
            win={win}
            useStore={useStore}
            topBar={<div>{win.title}</div>}
            key={win._id + "win"}
          >
            {win.type === "editor" && (
              <>
                <EditorBox win={win} useStore={useStore}></EditorBox>
              </>
            )}
            {win.type === "previewer" && (
              <>
                <Previewer win={win} useStore={useStore}></Previewer>
              </>
            )}

            {/* {win.type === "previewer2" && (
              <>
                <Previewer2 win={win} useStore={useStore}></Previewer2>
              </>
            )} */}
            {win.type === "coder" && (
              <>
                <Code win={win} useStore={useStore}></Code>
              </>
            )}

            {/*  */}
          </WinGeneric>
        );
      })}
    </>
  );
}

//

//

//
