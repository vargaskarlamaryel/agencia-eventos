from pydantic import BaseModel, EmailStr

class ReservaCreate(BaseModel):
    tipo_item: str
    item_nombre: str
    nombre_cliente: str
    correo: EmailStr
    telefono: str
    fecha_evento: str | None = None
    comentarios: str | None = None

class ReservaOut(ReservaCreate):
    id: int

    class Config:
        from_attributes = True