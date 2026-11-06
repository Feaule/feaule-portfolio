"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Current year, resolved in the browser so the statically built page never goes stale. */
export default function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => "",
  );
  return <>{year}</>;
}
