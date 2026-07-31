from sqlalchemy import Column, Integer, String, Numeric
from database import Base

class Servicio(Base):
    __tablename__ = "servicios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    categoria = Column(String, nullable=False)  # mobiliario, dj, buffet
    precio = Column(Numeric(10, 2), nullable=False)