from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioLogin, Token
from auth.hashing import hash_password, verify_password
from auth.jwt_handler import crear_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.execute(
        select(Usuario).where(Usuario.correo == usuario.correo)
    ).scalar_one_or_none()

    if existe:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo_usuario = Usuario(
        correo=usuario.correo,
        contrasena_hash=hash_password(usuario.contrasena),
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    token = crear_token({"sub": str(nuevo_usuario.id), "correo": nuevo_usuario.correo})
    return {"access_token": token}


@router.post("/login", response_model=Token)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.execute(
        select(Usuario).where(Usuario.correo == datos.correo)
    ).scalar_one_or_none()

    if not usuario or not verify_password(datos.contrasena, usuario.contrasena_hash):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    token = crear_token({"sub": str(usuario.id), "correo": usuario.correo})
    return {"access_token": token}