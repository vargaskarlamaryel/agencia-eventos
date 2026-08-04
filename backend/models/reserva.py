from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    tipo_item = Column(String, nullable=False)      # "salon" o "servicio"
    item_nombre = Column(String, nullable=False)     # nombre del salón/servicio reservado
    nombre_cliente = Column(String, nullable=False)
    correo = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    fecha_evento = Column(String, nullable=True)
    comentarios = Column(String, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())