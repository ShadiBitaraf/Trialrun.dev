from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore
import os
from fastapi.middleware.cors import CORSMiddleware

# Initialize Firebase once at startup
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "firebase-credentials.json")
app = FastAPI(title="TrialRun API")

# Initialize Firebase only once at startup
try:
    cred = credentials.Certificate(cred_path)
    firebase_app = firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class HandshakeRequest(BaseModel):
    sandbox_id: str
    base_url: Optional[str] = None

@app.post("/handshake")
async def handshake(request: HandshakeRequest):
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Firebase connection not available")

        doc_ref = db.collection("demoConfigs").document(request.sandbox_id)
        
        # If base_url is provided, update the document
        if request.base_url:
            doc_ref.set({"base_url": request.base_url}, merge=True)
        
        # Get the document data
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            # If document doesn't exist yet, return what we know
            return {"sandbox_id": request.sandbox_id, "base_url": request.base_url} if request.base_url else {"sandbox_id": request.sandbox_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Firestore operation failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
