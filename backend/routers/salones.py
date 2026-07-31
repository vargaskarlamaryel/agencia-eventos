from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.salon import Salon
from schemas.salon import SalonCreate, SalonOut
from auth.dependencies import get_current_user

router = APIRouter(prefix="/salones", tags=["salones"])

# Lectura pública — cualquiera puede ver el catálogo
@router.get("/", response_model=list[SalonOut])
def listar_salones(db: Session = Depends(get_db)):
    return db.execute(select(Salon)).scalars().all()

@router.get("/{salon_id}", response_model=SalonOut)
def obtener_salon(salon_id: int, db: Session = Depends(get_db)):
    salon = db.get(Salon, salon_id)
    if not salon:
        raise HTTPException(status_code=404, detail="Salón no encontrado")
    return salon

# Escritura protegida — solo admin autenticado
@router.post("/", response_model=SalonOut)
def crear_salon(
    salon: SalonCreate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    nuevo_salon = Salon(**salon.model_dump())
    db.add(nuevo_salon)
    db.commit()
    db.refresh(nuevo_salon)
    return nuevo_salon

@router.put("/{salon_id}", response_model=SalonOut)
def actualizar_salon(
    salon_id: int,
    datos: SalonCreate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    salon = db.get(Salon, salon_id)
    if not salon:
        raise HTTPException(status_code=404, detail="Salón no encontrado")
    for campo, valor in datos.model_dump().items():
        setattr(salon, campo, valor)
    db.commit()
    db.refresh(salon)
    return salon

@router.delete("/{salon_id}")
def eliminar_salon(
    salon_id: int,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    salon = db.get(Salon, salon_id)
    if not salon:
        raise HTTPException(status_code=404, detail="Salón no encontrado")
    db.delete(salon)
    db.commit()
    return {"detail": "Salón eliminado"}