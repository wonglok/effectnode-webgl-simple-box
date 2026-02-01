"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full relative">
      <div className=" ">
        {/*  */}
        <ol>
          <li>
            <Link href={`/edit`} prefetch>
              Editor
            </Link>
          </li>
          <li>
            <Link href={`/3d`} prefetch>
              3D Page
            </Link>
          </li>
        </ol>
        {/*  */}
      </div>
    </div>
  );
}
