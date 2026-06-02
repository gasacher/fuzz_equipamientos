import { appPath } from "@/lib/site-path";

/** Base del panel demo en GitHub Pages o local. */
export function panelDemoPath(sub = "") {
  const base = appPath("/panel");
  if (!sub) return base.endsWith("/") ? base.slice(0, -1) : base;
  const suffix = sub.startsWith("/") ? sub : `/${sub}`;
  return `${base}${suffix}`;
}
