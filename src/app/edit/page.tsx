"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectNode } from "../../../effectnode-developer-tools/effectnode-runtime/EffectNode";
import { EffectNodeStudio } from "../../../effectnode-developer-tools/effectnode-gui/editor-gui/EffectnodeGUI/EffectNodeStudio.jsx";

export default function () {
  return (
    <>
      <EffectNodeStudio projectName="living-room">
        <Canvas>
          <Suspense fallback={null}>
            <EffectNode projectName="living-room"></EffectNode>
          </Suspense>
        </Canvas>
        <div className=" absolute bottom-0 left-0 px-3 py-3">
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
      </EffectNodeStudio>
    </>
  );
}
