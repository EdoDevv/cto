import { SparklesIcon } from "@heroicons/react/24/outline";

interface TopBarProps {
  onRefresh: () => void;
}

export const TopBar = ({ onRefresh }: TopBarProps) => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/80 border-b border-slate-800/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <div className="inline-flex items-center space-x-3">
            <span className="rounded-full bg-primary-500/15 p-2 text-primary-300">
              <SparklesIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Mainteny Command Center</h1>
              <p className="text-sm text-slate-400">
                Coordinate vendors, triage work orders, and delight residents with a single dashboard.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-100 shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-500/20"
        >
          Refresh data
        </button>
      </div>
    </header>
  );
};
