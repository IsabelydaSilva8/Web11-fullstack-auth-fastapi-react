from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import bcrypt


import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Porta padrão do Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def gerar_senha_criptografada(senha_pura: str) -> str:
    # Converte a string para bytes, gera o sal (salt) e cria o hash
    senha_bytes = senha_pura.encode('utf-8')
    salt = bcrypt.gensalt()
    senha_hashed = bcrypt.hashpw(senha_bytes, salt)
    return senha_hashed.decode('utf-8')  # Salva no banco como texto

def verificar_senha(senha_pura: str, senha_criptografada_banco: str) -> bool:
    senha_bytes = senha_pura.encode('utf-8')
    banco_bytes = senha_criptografada_banco.encode('utf-8')
    return bcrypt.checkpw(senha_bytes, banco_bytes)

@app.get("/")
def pagina_inicial():
    return{"status": "Backend FastAPI rodando com sucesso!"}

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserAuth, db: Session = Depends(get_db)):
    # Verifica se o usuário já existe
    db_user = db.query(models.UserModel).filter(models.UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Criptografa a senha
    hashed_password = gerar_senha_criptografada(user.password)

    # Cria um novo usuário
    new_user = models.UserModel(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/login")
def login_user(user_data: schemas.UserAuth, db: Session = Depends(get_db)):
    # Verifica se o usuário existe
    db_user = db.query(models.UserModel).filter(models.UserModel.email == user_data.email).first()

    if not db_user or not verificar_senha(user_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    return {"message": "Login bem-sucedido",
            "token": "token-falso-de-autenticação",
            "user_EMAIL": user_data.email
        }
