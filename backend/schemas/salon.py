from pydantic import BaseModel

class SalonBase(BaseModel):
    nombre: str
    capacidad: int
    precio: float
    descripcion: str | None = None

class SalonCreate(SalonBase):
    pass

class SalonOut(SalonBase):
    id: int

    class Config:
        from_attributes = True