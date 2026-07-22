from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.user.dtos import RegisterSchema,LoginSchema
from app.user.models import UserModel,OTPVerificationModel
from fastapi import BackgroundTasks,HTTPException,Depends,Request
from http import HTTPStatus
from datetime import datetime,timedelta
from app.utils.settings import setting
import jwt
import random
from app.utils.db import get_db
import smtplib
from email.mime.text import MIMEText
import logging

logger = logging.getLogger(__name__)


def register(body:RegisterSchema,db:Session,background_tasks:BackgroundTasks):
    is_username=db.query(UserModel).filter(
        UserModel.username==body.username
    ).first()
    if is_username:
        raise HTTPException(400,detail="Username already exists...")
    
    pending_user=db.query(OTPVerificationModel).filter(
        OTPVerificationModel.username==body.username,
        OTPVerificationModel.expires_at>datetime.now()
    ).first()

    if pending_user:
        raise HTTPException(400,detail="Username is already registered and verification is pending...")

    is_email =db.query(UserModel).filter(
        UserModel.email==body.email
    ).first()
    if is_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user=UserModel(
        name=body.name,
        username=body.username,
        email=body.email,
        hash_password=hash_password(body.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate OTP and store in OTPVerificationModel
    otp = generate_otp()
    expires_at = datetime.now() + timedelta(minutes=10)
    
    # Delete any existing OTP records for this email
    db.query(OTPVerificationModel).filter(OTPVerificationModel.email == body.email).delete()
    
    otp_entry = OTPVerificationModel(
        email=body.email,
        otp_code=otp,
        expires_at=expires_at
    )
    db.add(otp_entry)
    db.commit()

    background_tasks.add_task(send_otp_email, body.email, otp)

    return user



pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(password,hashed):
    return pwd_context.verify(password,hashed)


def login(body:LoginSchema,db:Session):
    is_username=db.query(UserModel).filter(
         (UserModel.username==body.username) | (UserModel.email==body.username)
     ).first()

    if not is_username:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="You entered wrong username or email...")
    
    if not verify_password(body.password,is_username.hash_password):
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="You entered wrong password")
    
    if not is_username.is_verified:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail="Your email is not verified. Please verify using OTP."
        )
    
    exp_time=datetime.now()+timedelta(minutes=setting.EXP_TIME)
    token=jwt.encode(
        {
            "id": is_username.id,
            "exp": int(exp_time.timestamp())
        },
        setting.SECRET_KEY,
        algorithm=setting.ALGORITHM
    )
    
    return {
        "token":token
    }


## Token send - 

def is_authenticated(request:Request,
                     db:Session=Depends(get_db)):
    token=request.headers.get("authorization")
    if not token :
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="Authorization header missing")
    token=token.split(" ")[-1]
    try:
        data=jwt.decode(token, setting.SECRET_KEY, algorithms=[setting.ALGORITHM])
        user_id=data.get("id")
        exp_time=int(data["exp"])
        current_time=datetime.now().timestamp()
        if current_time>exp_time:
            raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="You are unauthorized.")
        
        user = db.query(UserModel).filter(
            UserModel.id == user_id
        ).first()
        if not user:
            raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="You are unauthorized.")
    
        return user
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=HTTPStatus.UNAUTHORIZED,detail="Invalid Token")

def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def send_otp_email(email: str, otp: str):
    # Print OTP to console for development verification
    print(f"\n========================================\n[OTP EMAIL] To: {email} | OTP: {otp}\n========================================\n", flush=True)
    
    # Try sending via SMTP if settings are configured
    if setting.SMTP_USERNAME and setting.SMTP_PASSWORD:
        try:
            msg = MIMEText(f"Your StaySmart verification code is: {otp}")
            msg['Subject'] = "StaySmart Verification Code"
            msg['From'] = setting.SMTP_FROM_EMAIL or setting.SMTP_USERNAME
            msg['To'] = email
            
            with smtplib.SMTP(setting.SMTP_HOST, setting.SMTP_PORT) as server:
                server.starttls()
                server.login(setting.SMTP_USERNAME, setting.SMTP_PASSWORD)
                server.send_message(msg)
            logger.info(f"OTP successfully sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send email to {email}: {e}")
            print(f"Failed to send email to {email}: {e}", flush=True)
    else:
        logger.info("SMTP credentials not fully configured. OTP printed to console only.")


def verify_otp_code(email: str, otp_code: str, db: Session):
    # Find active non-expired OTP record
    otp_record = db.query(OTPVerificationModel).filter(
        OTPVerificationModel.email == email,
        OTPVerificationModel.otp_code == otp_code
    ).order_by(OTPVerificationModel.id.desc()).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    if datetime.now() > otp_record.expires_at:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP code has expired")

    # Check if user already exists (fallback for existing user verification)
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if user:
        user.is_verified = True
        db.commit()
    elif otp_record.username:
        # Create user in UserModel since OTP is verified
        new_user = UserModel(
            name=otp_record.name or "",
            username=otp_record.username,
            hash_password=otp_record.hash_password or "",
            email=otp_record.email,
            is_verified=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    else:
        raise HTTPException(status_code=400, detail="Registration details missing in verification record")
        
    # Clean up OTP records
    db.query(OTPVerificationModel).filter(OTPVerificationModel.email == email).delete()
    db.commit()

    return {"message": "Email verified successfully"}

def resend_otp_code(email: str, background_tasks: BackgroundTasks,db: Session):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if user and user.is_verified:
        return {"message": "Email is already verified"}

    # Find the pending registration in OTPVerificationModel
    pending_reg = db.query(OTPVerificationModel).filter(OTPVerificationModel.email == email).first()
    if not user and not pending_reg:
        raise HTTPException(status_code=404, detail="User registration not found")

    # Generate and update OTP
    otp = generate_otp()
    expires_at = datetime.now() + timedelta(minutes=10)
    
    if pending_reg:
        pending_reg.otp_code = otp
        pending_reg.expires_at = expires_at
    else:
        # User exists but is unverified (fallback for existing users)
        db.query(OTPVerificationModel).filter(OTPVerificationModel.email == email).delete()
        otp_entry = OTPVerificationModel(
            email=email,
            otp_code=otp,
            expires_at=expires_at
        )
        db.add(otp_entry)
        
    db.commit()

    background_tasks.add_task(send_otp_email, email, otp)
    return {"message": "OTP resent successfully"}



