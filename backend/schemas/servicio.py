from pydantic import BaseModel

class ServicioBase(BaseModel):
    nombre: str
    categoria: str
    precio: float
    imagen_url: str | None = None

class ServicioCreate(ServicioBase):
    pass

class ServicioOut(ServicioBase):
    id: int

    class Config:
        from_attributes = True