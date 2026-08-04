from fastapi import FastAPI
from database import engine, Base
from routers import auth
from routers import salones
from routers import servicios
from routers import reservas
import models.servicio
import models.salon  # para que SQLAlchemy registre la tabla
import models.usuario  # necesario para que SQLAlchemy registre el modelo
import models.reserva


Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://agencia-eventos.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

app.include_router(salones.router)

app.include_router(servicios.router)

app.include_router(reservas.router)

from fastapi import Depends
from auth.dependencies import get_current_user

@app.get("/auth/me")
def perfil(usuario_actual: dict = Depends(get_current_user)):
    return {"correo": usuario_actual["correo"], "id": usuario_actual["sub"]}

@app.get("/")
def health_check():
    return {"status": "ok"}