import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { Mesh } from "three";

// @ts-ignore
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export function RoomContent({ files }: any) {
  let gltf = useGLTF(files["/env/interior.glb"]) as any;

  let cloned = clone(gltf.scene) as any;

  useEffect(() => {
    cloned.traverse((it: Mesh) => {
      if (it.isMesh) {
        it.castShadow = true;
        it.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <group
      onClick={(ev) => {
        console.log("clicked", ev.point.toArray(), ev.object.name);
      }}
    >
      <primitive object={cloned}></primitive>
    </group>
  );
}
