from __future__ import annotations

from typing import Iterable, Optional

from sqlmodel import Session, select

from .models import (
    MaintenanceTicket,
    MaintenanceTicketCreate,
    MaintenanceTicketUpdate,
    Property,
    PropertyCreate,
    PropertyUpdate,
    Unit,
    UnitCreate,
    UnitUpdate,
    Vendor,
    VendorCreate,
    VendorUpdate,
)


# Property CRUD

def list_properties(session: Session) -> Iterable[Property]:
    return session.exec(select(Property).order_by(Property.name)).all()


def get_property(session: Session, property_id: int) -> Optional[Property]:
    return session.get(Property, property_id)


def create_property(session: Session, data: PropertyCreate) -> Property:
    property_obj = Property.from_orm(data)
    session.add(property_obj)
    session.commit()
    session.refresh(property_obj)
    return property_obj


def update_property(session: Session, property_id: int, data: PropertyUpdate) -> Optional[Property]:
    property_obj = get_property(session, property_id)
    if not property_obj:
        return None
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(property_obj, key, value)
    property_obj.touch()
    session.add(property_obj)
    session.commit()
    session.refresh(property_obj)
    return property_obj


def delete_property(session: Session, property_id: int) -> bool:
    property_obj = get_property(session, property_id)
    if not property_obj:
        return False
    session.delete(property_obj)
    session.commit()
    return True


# Unit CRUD

def list_units(session: Session, property_id: Optional[int] = None) -> Iterable[Unit]:
    statement = select(Unit)
    if property_id is not None:
        statement = statement.where(Unit.property_id == property_id)
    return session.exec(statement.order_by(Unit.label)).all()


def get_unit(session: Session, unit_id: int) -> Optional[Unit]:
    return session.get(Unit, unit_id)


def create_unit(session: Session, data: UnitCreate) -> Unit:
    unit_obj = Unit.from_orm(data)
    session.add(unit_obj)
    session.commit()
    session.refresh(unit_obj)
    return unit_obj


def update_unit(session: Session, unit_id: int, data: UnitUpdate) -> Optional[Unit]:
    unit_obj = get_unit(session, unit_id)
    if not unit_obj:
        return None
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(unit_obj, key, value)
    unit_obj.touch()
    session.add(unit_obj)
    session.commit()
    session.refresh(unit_obj)
    return unit_obj


def delete_unit(session: Session, unit_id: int) -> bool:
    unit_obj = get_unit(session, unit_id)
    if not unit_obj:
        return False
    session.delete(unit_obj)
    session.commit()
    return True


# Vendor CRUD

def list_vendors(session: Session) -> Iterable[Vendor]:
    return session.exec(select(Vendor).order_by(Vendor.name)).all()


def get_vendor(session: Session, vendor_id: int) -> Optional[Vendor]:
    return session.get(Vendor, vendor_id)


def create_vendor(session: Session, data: VendorCreate) -> Vendor:
    vendor_obj = Vendor.from_orm(data)
    session.add(vendor_obj)
    session.commit()
    session.refresh(vendor_obj)
    return vendor_obj


def update_vendor(session: Session, vendor_id: int, data: VendorUpdate) -> Optional[Vendor]:
    vendor_obj = get_vendor(session, vendor_id)
    if not vendor_obj:
        return None
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vendor_obj, key, value)
    vendor_obj.touch()
    session.add(vendor_obj)
    session.commit()
    session.refresh(vendor_obj)
    return vendor_obj


def delete_vendor(session: Session, vendor_id: int) -> bool:
    vendor_obj = get_vendor(session, vendor_id)
    if not vendor_obj:
        return False
    session.delete(vendor_obj)
    session.commit()
    return True


# Maintenance ticket CRUD

def list_tickets(
    session: Session,
    *,
    property_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> Iterable[MaintenanceTicket]:
    statement = select(MaintenanceTicket)
    if property_id is not None:
        statement = statement.where(MaintenanceTicket.property_id == property_id)
    if status is not None:
        statement = statement.where(MaintenanceTicket.status == status)
    if priority is not None:
        statement = statement.where(MaintenanceTicket.priority == priority)
    statement = statement.order_by(MaintenanceTicket.priority.desc(), MaintenanceTicket.due_date)
    return session.exec(statement).all()


def get_ticket(session: Session, ticket_id: int) -> Optional[MaintenanceTicket]:
    return session.get(MaintenanceTicket, ticket_id)


def create_ticket(session: Session, data: MaintenanceTicketCreate) -> MaintenanceTicket:
    ticket_obj = MaintenanceTicket.from_orm(data)
    session.add(ticket_obj)
    session.commit()
    session.refresh(ticket_obj)
    return ticket_obj


def update_ticket(session: Session, ticket_id: int, data: MaintenanceTicketUpdate) -> Optional[MaintenanceTicket]:
    ticket_obj = get_ticket(session, ticket_id)
    if not ticket_obj:
        return None
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ticket_obj, key, value)
    ticket_obj.touch()
    session.add(ticket_obj)
    session.commit()
    session.refresh(ticket_obj)
    return ticket_obj


def delete_ticket(session: Session, ticket_id: int) -> bool:
    ticket_obj = get_ticket(session, ticket_id)
    if not ticket_obj:
        return False
    session.delete(ticket_obj)
    session.commit()
    return True
