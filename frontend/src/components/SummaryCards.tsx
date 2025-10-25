import { format } from "date-fns";
import { BuildingOfficeIcon, ClipboardDocumentCheckIcon, QueueListIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { MaintenanceTicket, Property, Vendor } from "../types";

const iconClasses = "h-6 w-6";

interface SummaryCardsProps {
  properties: Property[];
  vendors: Vendor[];
  tickets: MaintenanceTicket[];
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  accent
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
}) => {
  return (
    <div className="rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className={`rounded-full p-3 ${accent}`}>{icon}</span>
      </div>
      <p className="mt-4 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
};

export const SummaryCards = ({ properties, vendors, tickets }: SummaryCardsProps) => {
  const openTickets = tickets.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed");
  const urgentTickets = tickets.filter((ticket) => ticket.priority === "urgent");
  const nextDue = tickets
    .filter((t) => t.due_date)
    .sort((a, b) => new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime())[0];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Managed assets"
        value={`${properties.length}`}
        subtitle="Active multifamily properties on the platform"
        icon={<BuildingOfficeIcon className={`${iconClasses} text-primary-200`} />}
        accent="bg-primary-500/10"
      />
      <StatCard
        title="Preferred vendors"
        value={`${vendors.length}`}
        subtitle="Trade partners with up-to-date compliance"
        icon={<UserGroupIcon className={`${iconClasses} text-emerald-200`} />}
        accent="bg-emerald-500/10"
      />
      <StatCard
        title="Work orders in flight"
        value={`${openTickets.length}`}
        subtitle={`${urgentTickets.length} urgent interventions awaiting triage`}
        icon={<QueueListIcon className={`${iconClasses} text-amber-200`} />}
        accent="bg-amber-500/10"
      />
      <StatCard
        title="Next scheduled job"
        value={nextDue ? format(new Date(nextDue.due_date ?? ""), "MMM d") : "No date"}
        subtitle={nextDue ? nextDue.title : "Assign due dates to keep SLAs predictable"}
        icon={<ClipboardDocumentCheckIcon className={`${iconClasses} text-sky-200`} />}
        accent="bg-sky-500/10"
      />
    </section>
  );
};
