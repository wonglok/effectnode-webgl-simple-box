"use client";
import { Canvas } from "@react-three/fiber";
import { EffectNode } from "effectnode-developer-tools/effectnode-runtime/EffectNode";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <EffectNode projectName="living-room"></EffectNode>
      </Canvas>
    </div>
  );
}
