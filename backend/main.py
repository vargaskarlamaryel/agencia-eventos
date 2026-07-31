from fastapi import FastAPI
from database import engine, Base
from routers import auth
from routers import salones
from routers import servicios
import models.servicio
import models.salon  # para que SQLAlchemy registre la tabla
import models.usuario  # necesario para que SQLAlchemy registre el modelo

Base.metadata.create_all(bind=engine)

app = FastAPI()

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def manejador_global(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "traceback": traceback.format_exc()},
    )

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

from fastapi import Depends
from auth.dependencies import get_current_user

@app.get("/auth/me")
def perfil(usuario_actual: dict = Depends(get_current_user)):
    return {"correo": usuario_actual["correo"], "id": usuario_actual["sub"]}

@app.get("/")
def health_check():
    return {"status": "ok"}