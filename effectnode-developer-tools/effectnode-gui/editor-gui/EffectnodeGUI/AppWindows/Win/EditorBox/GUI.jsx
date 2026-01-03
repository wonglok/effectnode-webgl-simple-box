import { Box } from "@react-three/drei";
import { EffectNode } from "effectnode-developer-tools/effectnode-runtime/EffectNode";

export function GUI({ useStore, node }) {
  let spaceID = useStore((r) => r.spaceID);

  return (
    <>
      {spaceID && (
        <EffectNode
          mode="node"
          projectName={spaceID}
          useEditorStore={useStore}
          nodeID={node._id}
        ></EffectNode>
      )}
    </>
  );
}
