from pydantic import BaseModel

class RegisterSchema(BaseModel):
    name:str
    username:str
    email:str
    password:str

class RegisterResponseSchema(BaseModel):
    name:str
    username:str
    email:str
    id:int



class LoginSchema(BaseModel):
    username:str
    password:str

class VerifyOTPSchema(BaseModel):
    email:str
    otp_code:str

class ResendOTPSchema(BaseModel):
    email:str

class UserPreferenceSchema(BaseModel):
    budget:int
    preferred_city:str
    pets_allowed:bool
    wfh:bool

class GoogleLoginSchema(BaseModel):
    name: str
    email: str