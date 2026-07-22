import os
import sys
from fastapi.testclient import TestClient

# Add parent directory to path so app can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from app.utils.db import SessionLocal
from app.user.models import UserModel, OTPVerificationModel

client = TestClient(app)

def run_tests():
    print("--- Starting Endpoint Verification Tests ---\n")
    
    # 1. Clean up existing test user if any
    db = SessionLocal()
    try:
        test_email = "testuser@example.com"
        test_username = "testuser"
        
        db.query(UserModel).filter(UserModel.email == test_email).delete()
        db.query(OTPVerificationModel).filter(OTPVerificationModel.email == test_email).delete()
        db.commit()
        print("Cleaned up existing test data.")
        
        # 2. Test root endpoint
        response = client.get("/")
        assert response.status_code == 200, f"Root endpoint failed: {response.text}"
        print("[PASS] Root endpoint working.")
        
        # 3. Test registration endpoint
        register_payload = {
            "name": "Test User",
            "username": test_username,
            "email": test_email,
            "password": "SecurePassword123"
        }
        response = client.post("/user/register", json=register_payload)
        assert response.status_code == 201, f"Registration failed: {response.text}"
        data = response.json()
        assert data["email"] == test_email
        assert data["username"] == test_username
        print("[PASS] POST /user/register working.")
        
        # 4. Fetch the OTP code directly from the SQLite database
        otp_record = db.query(OTPVerificationModel).filter(
            OTPVerificationModel.email == test_email
        ).order_by(OTPVerificationModel.id.desc()).first()
        
        assert otp_record is not None, "OTP record was not created in the database!"
        otp_code = otp_record.otp_code
        print(f"Retrieved OTP code from database: {otp_code}")
        
        # 5. Test login BEFORE verification (should return 403 Forbidden)
        login_payload = {
            "username": test_username,
            "password": "SecurePassword123"
        }
        response = client.post("/user/login", json=login_payload)
        assert response.status_code == 403, f"Expected 403 Forbidden for unverified user, got: {response.status_code}"
        print("[PASS] POST /user/login correctly blocks unverified user (403).")
        
        # 6. Test OTP verification
        verify_payload = {
            "email": test_email,
            "otp_code": otp_code
        }
        response = client.post("/user/verify-otp", json=verify_payload)
        assert response.status_code == 200, f"OTP verification failed: {response.text}"
        assert response.json()["message"] == "Email verified successfully"
        print("[PASS] POST /user/verify-otp working.")
        
        # 7. Test login AFTER verification (should return 200 with token)
        response = client.post("/user/login", json=login_payload)
        assert response.status_code == 200, f"Login failed after verification: {response.text}"
        login_data = response.json()
        assert "token" in login_data
        token = login_data["token"]
        print("[PASS] POST /user/login working (returns JWT token).")
        
        # 8. Test is_auth with valid token
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/user/is_auth", headers=headers)
        assert response.status_code == 200, f"is_auth failed: {response.text}"
        auth_data = response.json()
        assert auth_data["email"] == test_email
        assert auth_data["username"] == test_username
        print("[PASS] GET /user/is_auth working with valid token.")
        
        # 9. Test is_auth with invalid token
        invalid_headers = {"Authorization": "Bearer invalidtoken123"}
        response = client.get("/user/is_auth", headers=invalid_headers)
        assert response.status_code == 401, f"Expected 401 Unauthorized, got: {response.status_code}"
        print("[PASS] GET /user/is_auth correctly handles invalid tokens (401).")
        
        print("\n=== ALL ENDPOINTS WORKING SUCCESSFULLY! ===")
        
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
