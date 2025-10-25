import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, MapPinIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { MaintenanceTicket } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { StatusPill } from "./StatusPill";

interface TicketListProps {
  tickets: MaintenanceTicket[];
  onStatusChange: (ticketId: number, status: MaintenanceTicket["status"]) => void;
  onDelete: (ticketId: number) => void;
}

const statusOptions: MaintenanceTicket["status"][] = ["open", "scheduled", "in_progress", "resolved", "closed"];

export const TicketList = ({ tickets, onStatusChange, onDelete }: TicketListProps) => {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <article
          key={ticket.id}
          className="group relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 transition hover:border-primary-500/50 hover:shadow-card"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={ticket.priority} />
                <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{ticket.description || "No description provided."}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {ticket.property?.name ?? `Property #${ticket.property_id}`}
                </span>
                {ticket.unit && (
                  <span className="inline-flex items-center gap-1">
                    <WrenchScrewdriverIcon className="h-4 w-4" />
                    Unit {ticket.unit.label}
                  </span>
                )}
                {ticket.due_date && <span>Due {new Date(ticket.due_date).toLocaleDateString()}</span>}
                {ticket.cost_estimate && <span>Est. € {ticket.cost_estimate.toFixed(0)}</span>}
                {ticket.vendor && <span>Assigned to {ticket.vendor.name}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <StatusPill status={ticket.status} />
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="rounded-full border border-slate-700/60 bg-slate-800/70 p-2 text-slate-400 transition hover:text-white">
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/95 shadow-xl">
                    <div className="p-1">
                      {statusOptions.map((status) => (
                        <Menu.Item key={status}>
                          {({ active }) => (
                            <button
                              onClick={() => onStatusChange(ticket.id, status)}
                              className={`flex w-full items-center rounded-xl px-3 py-2 text-sm capitalize transition ${
                                active ? "bg-primary-500/20 text-white" : "text-slate-300"
                              }`}
                            >
                              {status.replace("_", " ")}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onDelete(ticket.id)}
                            className={`flex w-full items-center rounded-xl px-3 py-2 text-sm transition ${
                              active ? "bg-rose-500/20 text-rose-100" : "text-rose-300"
                            }`}
                          >
                            Delete ticket
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
