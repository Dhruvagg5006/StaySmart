from sqlalchemy import Column,Integer,String,Boolean,DateTime
from app.utils.db import Base


class UserModel(Base):
    __tablename__="user_table"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    username=Column(String,nullable=False,index=True)
    email=Column(String)
    hash_password=Column(String,nullable=False)
    is_verified=Column(Boolean,default=False,nullable=False)


class OTPVerificationModel(Base):
        __tablename__="otp_verification"
        id=Column(Integer,primary_key=True,index=True)
        name=Column(String,nullable=True)
        username=Column(String,nullable=True)
        email=Column(String,index=True,nullable=False)
        otp_code=Column(String,nullable=False)
        hash_password=Column(String,nullable=True)
        expires_at=Column(DateTime,nullable=False)
    


