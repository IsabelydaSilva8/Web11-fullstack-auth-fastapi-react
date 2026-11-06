from pydantic import BaseModel, EmailStr

class UserAuth(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True