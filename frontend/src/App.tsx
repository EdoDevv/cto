import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { EmptyState } from "./components/EmptyState";
import { ErrorBanner } from "./components/ErrorBanner";
import { LoadingState } from "./components/LoadingState";
import { SummaryCards } from "./components/SummaryCards";
import { TicketForm } from "./components/TicketForm";
import { TicketList } from "./components/TicketList";
import { TopBar } from "./components/TopBar";
import { useDashboardData } from "./hooks/useDashboardData";

function App() {
  const { data, loading, error, reload, createTicket, updateTicketStatus, deleteTicket } = useDashboardData();
  const formRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopBar onRefresh={reload} />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="py-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-500/20 via-primary-500/10 to-slate-900/90 p-8 shadow-card">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-primary-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary-100">
                      Maintenance OS
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                      Bring hospitality-level service to property maintenance
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm text-primary-100/80">
                      Mainteny unifies resident communication, vendor management, and work order execution in one elegant workspace. Stop juggling spreadsheets and text messages—start operating like a best-in-class asset manager.
                    </p>
                  </div>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-primary-400/30 bg-slate-950/60 p-6 text-sm text-primary-100 shadow-soft">
                    <div className="flex items-center gap-3 text-left">
                      <span className="rounded-full bg-primary-500/20 p-2">
                        <ArrowTrendingUpIcon className="h-6 w-6 text-primary-200" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-primary-200/70">Turnaround speed</p>
                        <p className="text-2xl font-semibold text-white">-32%</p>
                      </div>
                    </div>
                    <p className="mt-6 text-xs text-primary-100/70">
                      Customers resolve resident issues 32% faster after centralising dispatch and vendor coordination in Mainteny.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-8">
                {error && <ErrorBanner message={error} onRetry={reload} />}
                {!error && data && <SummaryCards properties={data.properties} vendors={data.vendors} tickets={data.tickets} />}
                {loading && <LoadingState />}
                {!loading && data && data.tickets.length === 0 && (
                  <EmptyState
                    onCreate={() => {
                      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  />
                )}
                {!loading && data && data.tickets.length > 0 && (
                  <TicketList tickets={data.tickets} onStatusChange={updateTicketStatus} onDelete={deleteTicket} />
                )}
              </div>
            </div>
            <div ref={formRef} className="lg:sticky lg:top-28 lg:self-start">
              {data && (
                <TicketForm properties={data.properties} units={data.units} vendors={data.vendors} onSubmit={createTicket} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
