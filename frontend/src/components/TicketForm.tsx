import { FormEvent, useMemo, useState } from "react";
import { TicketFormValues, Property, Unit, Vendor } from "../types";

const defaultValues: TicketFormValues = {
  title: "",
  description: "",
  property_id: "",
  unit_id: "",
  vendor_id: "",
  priority: "medium",
  status: "open",
  due_date: "",
  cost_estimate: ""
};

interface TicketFormProps {
  properties: Property[];
  units: Unit[];
  vendors: Vendor[];
  onSubmit: (values: TicketFormValues) => Promise<void>;
}

const priorities: TicketFormValues["priority"][] = ["low", "medium", "high", "urgent"];

export const TicketForm = ({ properties, units, vendors, onSubmit }: TicketFormProps) => {
  const [values, setValues] = useState<TicketFormValues>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitsForProperty = useMemo(
    () => units.filter((unit) => (values.property_id ? unit.property_id === Number(values.property_id) : true)),
    [units, values.property_id]
  );

  const handleChange = (field: keyof TicketFormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.property_id) {
      setError("Select a property to create the work order");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSubmit(values);
      setValues(defaultValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Create new work order</h2>
          <p className="text-sm text-slate-400">
            Capture tenant requests, assign vendors, and broadcast timelines in seconds.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:cursor-not-allowed disabled:bg-primary-500/40"
        >
          {loading ? "Creating..." : "Log ticket"}
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Title
          <input
            type="text"
            required
            value={values.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="e.g. Replace HVAC filters"
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Property
          <select
            required
            value={values.property_id}
            onChange={(event) => handleChange("property_id", event.target.value)}
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            <option value="">Select property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Description
          <textarea
            rows={3}
            value={values.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="Add context from the resident or preventive schedule"
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Priority
            <div className="flex gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange("priority", priority)}
                  className={`flex-1 rounded-2xl border px-4 py-2 text-sm capitalize transition ${
                    values.priority === priority
                      ? "border-primary-500 bg-primary-500/20 text-primary-100"
                      : "border-slate-700/60 bg-slate-900/80 text-slate-300 hover:border-primary-400/40 hover:text-primary-100"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Due date
            <input
              type="date"
              value={values.due_date}
              onChange={(event) => handleChange("due_date", event.target.value)}
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Unit
          <select
            value={values.unit_id}
            onChange={(event) => handleChange("unit_id", event.target.value)}
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            <option value="">Entire property</option>
            {unitsForProperty.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Vendor
          <select
            value={values.vendor_id}
            onChange={(event) => handleChange("vendor_id", event.target.value)}
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            <option value="">Unassigned</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Estimate (€)
          <input
            type="number"
            min="0"
            step="50"
            value={values.cost_estimate}
            onChange={(event) => handleChange("cost_estimate", event.target.value)}
            placeholder="250"
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          />
        </label>
      </div>
    </form>
  );
};
