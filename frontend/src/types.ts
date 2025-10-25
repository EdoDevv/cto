export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "open" | "scheduled" | "in_progress" | "resolved" | "closed";

export interface Property {
  id: number;
  name: string;
  address: string;
  contact_email?: string | null;
  contact_phone?: string | null;
}

export interface Unit {
  id: number;
  property_id: number;
  label: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
}

export interface Vendor {
  id: number;
  name: string;
  specialty: string;
  email?: string | null;
  phone?: string | null;
}

export interface MaintenanceTicket {
  id: number;
  property_id: number;
  unit_id?: number | null;
  vendor_id?: number | null;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due_date?: string | null;
  cost_estimate?: number | null;
  property?: Property;
  unit?: Unit;
  vendor?: Vendor;
}

export interface DashboardData {
  properties: Property[];
  units: Unit[];
  vendors: Vendor[];
  tickets: MaintenanceTicket[];
}

export interface TicketFormValues {
  title: string;
  description: string;
  property_id: number | "";
  unit_id: number | "";
  vendor_id: number | "";
  priority: Priority;
  status: Status;
  due_date: string;
  cost_estimate: string;
}
