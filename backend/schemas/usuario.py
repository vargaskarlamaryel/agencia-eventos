from pydantic import BaseModel, EmailStr

class UsuarioCreate(BaseModel):
    correo: EmailStr
    contrasena: str

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"