from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class TimestampedModel(SQLModel):
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    def touch(self) -> None:
        self.updated_at = datetime.utcnow()


class PropertyBase(SQLModel):
    name: str = Field(index=True, max_length=100)
    address: str = Field(max_length=255)
    contact_email: Optional[str] = Field(default=None, max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=50)


class Property(PropertyBase, TimestampedModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    units: list[Unit] = Relationship(back_populates="property")
    tickets: list[MaintenanceTicket] = Relationship(back_populates="property")


class PropertyCreate(PropertyBase):
    pass


class PropertyRead(PropertyBase):
    id: int


class PropertyUpdate(SQLModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class UnitBase(SQLModel):
    label: str = Field(max_length=50)
    bedrooms: Optional[int] = Field(default=None, ge=0, description="Number of bedrooms")
    bathrooms: Optional[float] = Field(default=None, ge=0, description="Number of bathrooms")


class Unit(UnitBase, TimestampedModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    property_id: int = Field(foreign_key="property.id", nullable=False)

    property: Property = Relationship(back_populates="units")
    tickets: list[MaintenanceTicket] = Relationship(back_populates="unit")


class UnitCreate(UnitBase):
    property_id: int


class UnitRead(UnitBase):
    id: int
    property_id: int


class UnitUpdate(SQLModel):
    label: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None


class VendorBase(SQLModel):
    name: str = Field(max_length=100)
    specialty: str = Field(max_length=100)
    email: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)


class Vendor(VendorBase, TimestampedModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tickets: list[MaintenanceTicket] = Relationship(back_populates="vendor")


class VendorCreate(VendorBase):
    pass


class VendorRead(VendorBase):
    id: int


class VendorUpdate(SQLModel):
    name: Optional[str] = None
    specialty: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class MaintenanceTicketBase(SQLModel):
    title: str = Field(max_length=120)
    description: str = Field(default="", max_length=1000)
    priority: str = Field(default="medium", max_length=20, regex="^(low|medium|high|urgent)$")
    status: str = Field(default="open", max_length=20, regex="^(open|scheduled|in_progress|resolved|closed)$")
    due_date: Optional[datetime] = Field(default=None)
    cost_estimate: Optional[float] = Field(default=None, ge=0)


class MaintenanceTicket(MaintenanceTicketBase, TimestampedModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    property_id: int = Field(foreign_key="property.id")
    unit_id: Optional[int] = Field(default=None, foreign_key="unit.id")
    vendor_id: Optional[int] = Field(default=None, foreign_key="vendor.id")

    property: Property = Relationship(back_populates="tickets")
    unit: Optional[Unit] = Relationship(back_populates="tickets")
    vendor: Optional[Vendor] = Relationship(back_populates="tickets")


class MaintenanceTicketCreate(MaintenanceTicketBase):
    property_id: int
    unit_id: Optional[int] = None
    vendor_id: Optional[int] = None


class MaintenanceTicketRead(MaintenanceTicketBase):
    id: int
    property_id: int
    unit_id: Optional[int]
    vendor_id: Optional[int]


class MaintenanceTicketUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    cost_estimate: Optional[float] = None
    property_id: Optional[int] = None
    unit_id: Optional[int] = None
    vendor_id: Optional[int] = None
