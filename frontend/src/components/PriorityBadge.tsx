import clsx from "clsx";
import { Priority } from "../types";

const priorityStyles: Record<Priority, string> = {
  low: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30",
  medium: "bg-sky-500/10 text-sky-200 border-sky-500/30",
  high: "bg-amber-500/10 text-amber-200 border-amber-500/40",
  urgent: "bg-rose-500/15 text-rose-100 border-rose-500/40 animate-pulse"
};

export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <span className={clsx("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase", priorityStyles[priority])}>
    {priority}
  </span>
);
