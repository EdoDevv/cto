import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DashboardData, MaintenanceTicket, Property, TicketFormValues, Unit, Vendor } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000"
});

const mapTicket = (ticket: MaintenanceTicket, properties: Property[], units: Unit[], vendors: Vendor[]): MaintenanceTicket => {
  return {
    ...ticket,
    property: properties.find((p) => p.id === ticket.property_id),
    unit: units.find((u) => u.id === ticket.unit_id ?? -1),
    vendor: vendors.find((v) => v.id === ticket.vendor_id ?? -1)
  };
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [propertiesRes, unitsRes, vendorsRes, ticketsRes] = await Promise.all([
        api.get<Property[]>("/properties"),
        api.get<Unit[]>("/units"),
        api.get<Vendor[]>("/vendors"),
        api.get<MaintenanceTicket[]>("/tickets")
      ]);
      const properties = propertiesRes.data;
      const units = unitsRes.data;
      const vendors = vendorsRes.data;
      const tickets = ticketsRes.data.map((ticket) => mapTicket(ticket, properties, units, vendors));

      setData({ properties, units, vendors, tickets });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createTicket = useCallback(
    async (values: TicketFormValues) => {
      const payload = {
        ...values,
        property_id: Number(values.property_id),
        unit_id: values.unit_id === "" ? null : Number(values.unit_id),
        vendor_id: values.vendor_id === "" ? null : Number(values.vendor_id),
        cost_estimate:
          values.cost_estimate === "" || Number.isNaN(Number(values.cost_estimate))
            ? null
            : Number(values.cost_estimate),
        due_date: values.due_date === "" ? null : values.due_date
      };

      await api.post<MaintenanceTicket>("/tickets", payload);
      await load();
    },
    [load]
  );

  const updateTicketStatus = useCallback(
    async (ticketId: number, status: MaintenanceTicket["status"]) => {
      await api.put(`/tickets/${ticketId}`, { status });
      await load();
    },
    [load]
  );

  const deleteTicket = useCallback(
    async (ticketId: number) => {
      await api.delete(`/tickets/${ticketId}`);
      await load();
    },
    [load]
  );

  return { data, loading, error, reload: load, createTicket, updateTicketStatus, deleteTicket };
};
