from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.reserva import Reserva
from schemas.reserva import ReservaCreate, ReservaOut
from auth.dependencies import get_current_user

router = APIRouter(prefix="/reservas", tags=["reservas"])

# Público — cualquier cliente puede enviar una solicitud de reserva
@router.post("/", response_model=ReservaOut)
def crear_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    nueva = Reserva(**reserva.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# Protegido — solo el admin ve las solicitudes recibidas
@router.get("/", response_model=list[ReservaOut])
def listar_reservas(db: Session = Depends(get_db), usuario_actual: dict = Depends(get_current_user)):
    return db.execute(select(Reserva)).scalars().all()