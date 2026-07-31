from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.servicio import Servicio
from schemas.servicio import ServicioCreate, ServicioOut
from auth.dependencies import get_current_user

router = APIRouter(prefix="/servicios", tags=["servicios"])

@router.get("/", response_model=list[ServicioOut])
def listar_servicios(categoria: str | None = Query(None), db: Session = Depends(get_db)):
    stmt = select(Servicio)
    if categoria:
        stmt = stmt.where(Servicio.categoria == categoria)
    return db.execute(stmt).scalars().all()

@router.get("/{servicio_id}", response_model=ServicioOut)
def obtener_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = db.get(Servicio, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio

@router.post("/", response_model=ServicioOut)
def crear_servicio(
    servicio: ServicioCreate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    nuevo_servicio = Servicio(**servicio.model_dump())
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return nuevo_servicio

@router.put("/{servicio_id}", response_model=ServicioOut)
def actualizar_servicio(
    servicio_id: int,
    datos: ServicioCreate,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    servicio = db.get(Servicio, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    for campo, valor in datos.model_dump().items():
        setattr(servicio, campo, valor)
    db.commit()
    db.refresh(servicio)
    return servicio

@router.delete("/{servicio_id}")
def eliminar_servicio(
    servicio_id: int,
    db: Session = Depends(get_db),
    usuario_actual: dict = Depends(get_current_user),
):
    servicio = db.get(Servicio, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    db.delete(servicio)
    db.commit()
    return {"detail": "Servicio eliminado"}