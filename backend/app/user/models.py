from sqlalchemy import Column,Integer,String,Boolean,DateTime,ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.utils.db import Base


class UserModel(Base):
    __tablename__="user_table"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    username=Column(String,nullable=False,index=True)
    email=Column(String)
    hash_password=Column(String,nullable=False)
    is_verified=Column(Boolean,default=False,nullable=False)
    preferences=relationship("UserPreferenceModel",back_populates="user",uselist=False,cascade="all, delete-orphan")
    wishlist=relationship("WishlistModel",back_populates="user",cascade="all,delete-orphan")
    search_history=relationship("SearchHistoryModel",back_populates="user",cascade="all, delete-orphan")

#UserPreferenceModel fields: id, user_id, budget, preferred_city, pets_allowed, work_from_home.

class UserPreferenceModel(Base):
    __tablename__="user_preference"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("user_table.id",ondelete="CASCADE"),unique=True,nullable=False)
    budget=Column(Integer,nullable=True)
    preferred_city=Column(String,nullable=True)
    pets_allowed=Column(Boolean,default=False,nullable=True)
    wfh=Column(Boolean,default=False,nullable=True)

    user=relationship("UserModel",back_populates="preferences")


class WishlistModel(Base):
     __tablename__="user_wishlist"
     id=Column(Integer,primary_key=True,index=True)
     user_id=Column(Integer,ForeignKey("user_table.id",ondelete="CASCADE"),nullable=False)
     property_id=Column(Integer,nullable=False)
     created_at=Column(DateTime,default=lambda: datetime.now(timezone.utc),nullable=False)
     user=relationship("UserModel",back_populates="wishlist")

class SearchHistoryModel(Base):
    __tablename__ = "user_search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_table.id", ondelete="CASCADE"), nullable=False)
    city = Column(String, nullable=True)
    budget = Column(Integer, nullable=True)
    bedrooms = Column(Integer, nullable=True)
    wifi = Column(Boolean, nullable=True)
    created_at = Column(DateTime,default=lambda: datetime.now(timezone.utc),nullable=False)
    
    user = relationship("UserModel", back_populates="search_history")

class OTPVerificationModel(Base):
        __tablename__="otp_verification"
        id=Column(Integer,primary_key=True,index=True)
        name=Column(String,nullable=True)
        username=Column(String,nullable=True)
        email=Column(String,index=True,nullable=False)
        otp_code=Column(String,nullable=False)
        hash_password=Column(String,nullable=True)
        expires_at=Column(DateTime,nullable=False)
    


