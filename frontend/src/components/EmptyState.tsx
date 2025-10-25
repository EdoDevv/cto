import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  onCreate: () => void;
}

export const EmptyState = ({ onCreate }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700/60 bg-slate-900/60 p-12 text-center text-slate-400">
    <ClipboardDocumentListIcon className="h-16 w-16 text-primary-400" />
    <h3 className="mt-4 text-xl font-semibold text-white">No maintenance tickets yet</h3>
    <p className="mt-2 max-w-xl text-sm">
      You’re fully in control. Once residents submit their first request or you plan a preventive job, it will appear here with instant status tracking.
    </p>
    <button
      onClick={onCreate}
      className="mt-6 rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
    >
      Log your first work order
    </button>
  </div>
);
