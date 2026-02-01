"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      <div className=" p-3 ">
        {/*  */}
        <ol>
          <li className="p-3 underline">
            <Link href={`/edit`} prefetch>
              3D Editor
            </Link>
          </li>
          <li className="p-3 underline">
            <Link href={`/3d`} prefetch>
              3D Viewer
            </Link>
          </li>
        </ol>
        {/*  */}
        {/*  */}
        {/*  */}
      </div>
    </div>
  );
}
