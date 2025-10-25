import clsx from "clsx";
import { Status } from "../types";

const statusStyles: Record<Status, string> = {
  open: "bg-slate-800 text-slate-100 border-slate-600",
  scheduled: "bg-sky-500/10 text-sky-100 border-sky-400/40",
  in_progress: "bg-amber-500/10 text-amber-100 border-amber-400/40",
  resolved: "bg-emerald-500/10 text-emerald-100 border-emerald-400/40",
  closed: "bg-slate-900 text-slate-400 border-slate-700"
};

export const StatusPill = ({ status }: { status: Status }) => (
  <span className={clsx("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize", statusStyles[status])}>
    {status.replace("_", " ")}
  </span>
);
