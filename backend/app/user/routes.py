from fastapi import APIRouter , Depends , Request,BackgroundTasks
from app.user.dtos import RegisterSchema ,LoginSchema,RegisterResponseSchema,VerifyOTPSchema,ResendOTPSchema
from http import HTTPStatus
from app.utils.db import get_db
from sqlalchemy.orm import Session
from app.user import controller
router=APIRouter(prefix="/user",tags=["user"])

@router.post("/register",
             response_model=RegisterResponseSchema,
             status_code=HTTPStatus.CREATED)
def register(body:RegisterSchema,
             background_tasks:BackgroundTasks,
             db:Session=Depends(get_db)):
    return controller.register(body,db,background_tasks)

@router.post("/verify-otp",status_code=HTTPStatus.OK)
def verify_otp(body:VerifyOTPSchema,db:Session=Depends(get_db)):
    return controller.verify_otp_code(body.email,body.otp_code,db)

@router.post("/resend-otp",status_code=HTTPStatus.OK)
def resend_otp(body:ResendOTPSchema,background_tasks:BackgroundTasks,db:Session=Depends(get_db)):
    return controller.resend_otp_code(body.email,background_tasks,db)

@router.post("/login",status_code=HTTPStatus.OK)
def login(body:LoginSchema,db:Session=Depends(get_db)):
    return controller.login(body,db)

@router.get("/is_auth",response_model=RegisterResponseSchema, status_code=HTTPStatus.OK)

def is_auth(request:Request,db:Session=Depends(get_db)):
    return controller.is_authenticated(request,db)

