"use client";
import { Canvas } from "@react-three/fiber";
import { EffectNode } from "effectnode-developer-tools/effectnode-runtime/EffectNode";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      <Canvas>
        <EffectNode projectName="living-room"></EffectNode>
      </Canvas>
      <div className=" absolute bottom-0 right-0 px-3 py-3">
        <div className="bg-white rounded-lg p-1 px-3">
          <a
            className="underline"
            target="_blank"
            href={`https://www.fab.com/listings/a926d36d-6460-4c6e-8aaa-c22667cb075f`}
          >
            3D Scene by Alister
          </a>
        </div>
      </div>
    </div>
  );
}
