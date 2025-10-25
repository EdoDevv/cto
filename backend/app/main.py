from __future__ import annotations

from datetime import datetime
from typing import Annotated, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from . import crud
from .database import get_session, init_db
from .models import (
    MaintenanceTicket,
    MaintenanceTicketCreate,
    MaintenanceTicketRead,
    MaintenanceTicketUpdate,
    Property,
    PropertyCreate,
    PropertyRead,
    PropertyUpdate,
    Unit,
    UnitCreate,
    UnitRead,
    UnitUpdate,
    Vendor,
    VendorCreate,
    VendorRead,
    VendorUpdate,
)

init_db()

app = FastAPI(
    title="Mainteny",
    description="Operations platform for property maintenance teams",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SessionDep = Annotated[Session, Depends(get_session)]


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


# Property routes


@app.get("/properties", response_model=list[PropertyRead])
def api_list_properties(session: SessionDep) -> list[Property]:
    return list(crud.list_properties(session))


@app.post("/properties", response_model=PropertyRead, status_code=201)
def api_create_property(data: PropertyCreate, session: SessionDep) -> Property:
    return crud.create_property(session, data)


@app.get("/properties/{property_id}", response_model=PropertyRead)
def api_get_property(property_id: int, session: SessionDep) -> Property:
    property_obj = crud.get_property(session, property_id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj


@app.put("/properties/{property_id}", response_model=PropertyRead)
def api_update_property(property_id: int, data: PropertyUpdate, session: SessionDep) -> Property:
    property_obj = crud.update_property(session, property_id, data)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj


@app.delete("/properties/{property_id}", status_code=204)
def api_delete_property(property_id: int, session: SessionDep) -> None:
    success = crud.delete_property(session, property_id)
    if not success:
        raise HTTPException(status_code=404, detail="Property not found")


# Unit routes


@app.get("/units", response_model=list[UnitRead])
def api_list_units(property_id: Optional[int] = None, session: Session = Depends(get_session)) -> list[Unit]:
    return list(crud.list_units(session, property_id=property_id))


@app.post("/units", response_model=UnitRead, status_code=201)
def api_create_unit(data: UnitCreate, session: SessionDep) -> Unit:
    return crud.create_unit(session, data)


@app.put("/units/{unit_id}", response_model=UnitRead)
def api_update_unit(unit_id: int, data: UnitUpdate, session: SessionDep) -> Unit:
    unit_obj = crud.update_unit(session, unit_id, data)
    if not unit_obj:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit_obj


@app.delete("/units/{unit_id}", status_code=204)
def api_delete_unit(unit_id: int, session: SessionDep) -> None:
    success = crud.delete_unit(session, unit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Unit not found")


# Vendor routes


@app.get("/vendors", response_model=list[VendorRead])
def api_list_vendors(session: SessionDep) -> list[Vendor]:
    return list(crud.list_vendors(session))


@app.post("/vendors", response_model=VendorRead, status_code=201)
def api_create_vendor(data: VendorCreate, session: SessionDep) -> Vendor:
    return crud.create_vendor(session, data)


@app.put("/vendors/{vendor_id}", response_model=VendorRead)
def api_update_vendor(vendor_id: int, data: VendorUpdate, session: SessionDep) -> Vendor:
    vendor_obj = crud.update_vendor(session, vendor_id, data)
    if not vendor_obj:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor_obj


@app.delete("/vendors/{vendor_id}", status_code=204)
def api_delete_vendor(vendor_id: int, session: SessionDep) -> None:
    success = crud.delete_vendor(session, vendor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vendor not found")


# Maintenance ticket routes


@app.get("/tickets", response_model=list[MaintenanceTicketRead])
def api_list_tickets(
    session: SessionDep,
    property_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> list[MaintenanceTicket]:
    return list(
        crud.list_tickets(session, property_id=property_id, status=status, priority=priority)
    )


@app.post("/tickets", response_model=MaintenanceTicketRead, status_code=201)
def api_create_ticket(data: MaintenanceTicketCreate, session: SessionDep) -> MaintenanceTicket:
    return crud.create_ticket(session, data)


@app.get("/tickets/{ticket_id}", response_model=MaintenanceTicketRead)
def api_get_ticket(ticket_id: int, session: SessionDep) -> MaintenanceTicket:
    ticket_obj = crud.get_ticket(session, ticket_id)
    if not ticket_obj:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket_obj


@app.put("/tickets/{ticket_id}", response_model=MaintenanceTicketRead)
def api_update_ticket(
    ticket_id: int, data: MaintenanceTicketUpdate, session: SessionDep
) -> MaintenanceTicket:
    ticket_obj = crud.update_ticket(session, ticket_id, data)
    if not ticket_obj:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket_obj


@app.delete("/tickets/{ticket_id}", status_code=204)
def api_delete_ticket(ticket_id: int, session: SessionDep) -> None:
    success = crud.delete_ticket(session, ticket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
