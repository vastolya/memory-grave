"use client";
import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("./components/viewer"), { ssr: false });

export default function Home() {
  return <Viewer />;
}
