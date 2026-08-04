from sqlalchemy import Column, Integer, String, Numeric
from database import Base

class Salon(Base):
    __tablename__ = "salones"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    capacidad = Column(Integer, nullable=False)
    precio = Column(Numeric(10, 2), nullable=False)
    descripcion = Column(String, nullable=True)
    imagen_url = Column(String, nullable=True)