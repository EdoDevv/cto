from __future__ import annotations

from datetime import datetime, timedelta

from sqlmodel import Session, func, select

from .crud import create_property, create_ticket, create_unit, create_vendor
from .database import get_session, init_db
from .models import MaintenanceTicketCreate, Property, PropertyCreate, Unit, UnitCreate, Vendor, VendorCreate


def seed() -> None:
    init_db()
    with get_session() as session:
        existing = session.exec(select(func.count()).select_from(Property)).one()
        if existing and existing[0] > 0:
            return
        _seed_properties(session)
        _seed_vendors(session)
        _seed_tickets(session)


def _seed_properties(session: Session) -> None:
    downtown = create_property(
        session,
        PropertyCreate(
            name="Aurora Residences",
            address="125 Market Street, Milan",
            contact_email="concierge@auroraresidences.it",
            contact_phone="+39 02 1234 5678",
        ),
    )
    create_unit(session, UnitCreate(property_id=downtown.id, label="12A", bedrooms=2, bathrooms=1.5))
    create_unit(session, UnitCreate(property_id=downtown.id, label="18C", bedrooms=3, bathrooms=2))

    create_property(
        session,
        PropertyCreate(
            name="Lago Blu Villas",
            address="Via Lungo Lago 8, Como",
            contact_email="operations@lagoblu.it",
            contact_phone="+39 031 987 6543",
        ),
    )


def _seed_vendors(session: Session) -> None:
    create_vendor(
        session,
        VendorCreate(name="EcoSpark Electrical", specialty="Electrical", email="dispatch@ecospark.eu", phone="+39 081 456 7890"),
    )
    create_vendor(
        session,
        VendorCreate(name="BlueWave HVAC", specialty="HVAC", email="hello@bluewaveclimate.it", phone="+39 055 555 1200"),
    )


def _seed_tickets(session: Session) -> None:
    property_id = session.exec(select(Property.id)).first()
    unit_id = session.exec(select(Unit.id)).first()
    vendor_id = session.exec(select(Vendor.id)).first()

    if not (property_id and unit_id and vendor_id):
        return

    create_ticket(
        session,
        MaintenanceTicketCreate(
            title="Emergency boiler repair",
            description="Resident reported no hot water in unit 12A. Pressure is below threshold.",
            property_id=property_id,
            unit_id=unit_id,
            vendor_id=vendor_id,
            priority="urgent",
            status="scheduled",
            due_date=datetime.utcnow() + timedelta(days=1),
            cost_estimate=480.0,
        ),
    )


if __name__ == "__main__":
    seed()
