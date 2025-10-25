import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex items-center justify-between rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
    <div className="flex items-center gap-3">
      <ExclamationTriangleIcon className="h-6 w-6" />
      <span>{message}</span>
    </div>
    <button onClick={onRetry} className="rounded-full border border-rose-500/50 px-4 py-1 text-xs font-semibold uppercase">
      Retry
    </button>
  </div>
);
