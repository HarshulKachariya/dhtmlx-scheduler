import type { MetaFunction } from "@remix-run/node";
import { lazy, Suspense } from "react";
import Scheduler from "../components/Scheduler";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Scheduler />
      {/* </Suspense> */}
    </div>
  );
}
