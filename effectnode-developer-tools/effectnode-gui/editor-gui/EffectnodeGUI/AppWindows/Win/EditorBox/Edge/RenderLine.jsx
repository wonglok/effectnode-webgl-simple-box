// import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
// import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
// import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
// import { Line2 } from "three/examples/jsm/lines/Line2";

import { Color, Vector3 } from "three/webgpu";
import { useMemo, useRef } from "react";

import { Line2 } from 'three/addons/lines/webgpu/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { CubicBezierCurve3, Line2NodeMaterial } from "three/webgpu";

export function RenderLine({ start = [1, 0, 1], end = [0, 0, 0] }) {
  // let refDash = useRef();

  // useFrame(() => {
  //   if (refDash.current) {

  //     refDash.current.material.uniforms.dashOffset.value += -1 * 0.3;
  //   }
  // });

  const mat = useMemo(() => {
    return getMat();
  }, []);

  const { geo } = useMemo(() => {
    let { geo } = getGeo({
      a: new Vector3().fromArray(start),
      b: new Vector3().fromArray(end),
      dotted: false,
    });
    return { geo };
  }, [start, end]);

  //

  const { line, displayLine } = useMemo(() => {
    if (!geo || !mat) {
      return {
        line: null,
        displayLine: null
      }
    }

    let line = getLine({ geo, mat });
    line.computeLineDistances()

    let displayLine = <primitive object={line}></primitive>;
    return { line, displayLine };
  }, [geo, mat]);

  //

  // let midA = useMemo(() => {
  //   let midA = new Vector3()
  //     .fromArray(start)
  //     .add(new Vector3().fromArray(end))
  //     .divideScalar(2);

  //   midA.y += 1;
  //   //

  //   return midA.toArray();
  // }, [start, end]);

  // let midB = useMemo(() => {
  //   let midB = new Vector3()
  //     .fromArray(start)
  //     .add(new Vector3().fromArray(end))
  //     .divideScalar(2);

  //   midB.y += 1;

  //   return midB.toArray();
  // }, [start, end]);

  return (
    <>

      {displayLine}

      {/* <CubicBezierLine
        ref={refDash}
        start={[start[0], start[1], start[2]]}
        midA={[
          //
          mix(start[0], end[0], 0.85),
          start[1],
          mix(start[2], end[2], 0.15),
        ]}
        midB={[
          //
          mix(start[0], end[0], 0.15),
          end[1],
          mix(start[2], end[2], 0.85),
        ]}
        end={[end[0], end[1], end[2]]}
        color="teal"
        dashed
        dashScale={10}
        gapSize={3}
        transparent
        opacity={0.5}
        lineWidth={3}
      />

      <CubicBezierLine
        start={[start[0], start[1], start[2]]}
        midA={[
          //
          mix(start[0], end[0], 0.85),
          start[1],
          mix(start[2], end[2], 0.15),
        ]}
        midB={[
          //
          mix(start[0], end[0], 0.15),
          end[1],
          mix(start[2], end[2], 0.85),
        ]}
        end={[end[0], end[1], end[2]]}
        color="cyan"
        opacity={0.5}
        lineWidth={2}
        transparent
      /> */}
      {/*  */}

      {/*  */}
    </>
  );
}

export const getLine = ({ geo, mat }) => {
  let line2 = new Line2(geo, mat);

  line2.computeLineDistances();

  return line2;
};

export const getMat = () => {
  const matLine = new Line2NodeMaterial({

    color: 0xffffff,
    linewidth: 2, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,

  });

  return matLine;
};


const mix = (a, b, t) => {
  return a * t + b * (1.0 - t);
};



export const getGeo = ({ a, b, dotted = false }) => {
  // const dist = new Vector3().copy(a).distanceTo(b);

  let raise = 0.1;

  let start = a.toArray();
  let end = b.toArray();

  if (isNaN(start[0])) {
    start[0] = 0
  }
  if (isNaN(start[1])) {
    start[1] = 0
  }
  if (isNaN(start[2])) {
    start[2] = 0
  }
  if (isNaN(end[0])) {
    end[0] = 1
  }
  if (isNaN(end[1])) {
    end[1] = 1
  }
  if (isNaN(end[2])) {
    end[2] = 1
  }

  const curvePts = new CubicBezierCurve3(
    new Vector3().fromArray([start[0], start[1], start[2]]),
    new Vector3().fromArray([
      //
      mix(start[0], end[0], 0.85),
      start[1],
      mix(start[2], end[2], 0.15),
    ]),
    new Vector3().fromArray([
      //
      mix(start[0], end[0], 0.15),
      end[1],
      mix(start[2], end[2], 0.85),
    ]),
    new Vector3().fromArray([
      //
      end[0], end[1], end[2]]))

  let lineGeo = new LineGeometry();
  // if (dotted) {
  //   lineGeo = new LineGeometry();
  // }

  let colors = [];
  let count = 150;

  let colorA = new Color();
  let colorB = new Color("#0000ff");
  let points = [];

  for (let i = 0; i < count; i++) {
    colorA.setStyle("#00ff00");
    colorA.lerp(colorB, (i / count) % 1);

    //
    colorA.offsetHSL(0, 0.5, 0.0);
    colors.push(colorA.r, colorA.g, colorA.b);
  }

  lineGeo.setColors(colors);
  lineGeo.setFromPoints(curvePts.getPoints(100))
  return { geo: lineGeo, points };
};
