import os
from fastapi import Header, HTTPException # type: ignore

def verify_secret(x_service_secret: str = Header(None)):
    if x_service_secret != os.getenv("SERVICE_SECRET"):
        raise HTTPException(status_code=401, detail="Unauthorized")