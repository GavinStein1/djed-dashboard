import os
import requests
import jwt
import datetime

firebase_secret = os.environ.get("FIREBASE_SECRET_KEY")
service_account_email = os.environ.get("SERVICE_ACCOUNT_EMAIL")

def create_signed_jwt():
    # Set the expiration time for the token (adjust as needed)
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    iat = datetime.datetime.utcnow()

    # Build the JWT payload
    jwt_payload = {
        "exp": expiration_time,
        "iat": iat,
        "iss": service_account_email,
        "scope": "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
        "aud": "https://oauth2.googleapis.com/token"
    }

    # Create and sign the JWT
    jwt_token = jwt.encode(jwt_payload, firebase_secret, algorithm="RS256")

    return jwt_token

def get_access_token():
    jwt = create_signed_jwt()
    url = "https://oauth2.googleapis.com/token"
    form_data = {
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt
    }

    response = requests.post(url, data=form_data)
    if response.status_code != 200:
        raise Exception
    
    return response.json()["access_token"]

