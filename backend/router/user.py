
from fastapi import APIRouter,HTTPException,Request # type: ignore
from pydantic import BaseModel# type: ignore
from typing import List, Optional
from bson import ObjectId #type : ignore
from configurations import user_collection
userRouter = APIRouter()
from fastapi import Response
from auth import create_access_token
from middleware import get_current_user_id
from fastapi import Depends
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
from jose import jwt
from dotenv import load_dotenv
from uuid import uuid4
import os
load_dotenv()

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile', 'prompt':'consent'}
)



class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class Video(BaseModel):
    prompt: str
    url: str
    conversationId: str

class User(BaseModel):
    username: str
    password: str
    videos: Optional[List[Video]] = []

class LoginRequest(BaseModel):
    username: str
    password: str

class AddVideoRequest(BaseModel):
    user_id: str
    prompt: str
    url: str

    
@userRouter.get("/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for('google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@userRouter.get("/auth/google")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    # print("🔑 TOKEN:", token)
    # user_info = await oauth.google.parse_id_token(request, token)
    user_info = token.get("userinfo")


    email = user_info.get("email")
    name = user_info.get("name", "NoName")

    existing_user = user_collection.find_one({"username": email})
    if not existing_user:
        user_data = {"username": email, "name": name, "password": None}
        result = user_collection.insert_one(user_data)
        user_id = result.inserted_id
    else:
        user_id = existing_user["_id"]

    access_token = create_access_token({"user_id": str(user_id)})

    # ✅ Set the cookie in a response object
    response = RedirectResponse(url="http://localhost:5173/dashboard")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="Lax"
    )
    return response


@userRouter.post("/signup")
def signup(user: User):
    # Check if user already exists
    existing_user = user_collection.find_one({"username": user.username.strip().lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    user_dict = user.model_dump()
    user_dict["username"] = user.username.strip().lower()
    result = user_collection.insert_one(user_dict)
    return {"message": "User created", "user_id": str(result.inserted_id)}

@userRouter.post("/signin")
def signin(login: LoginRequest, response: Response):
    user = user_collection.find_one({
        "username": login.username.strip().lower(),
        "password": login.password  # in real apps, hash this!
    })

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"user_id": str(user["_id"])})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax"
    )

    return {"message": "Login successful", "user_id": str(user["_id"])}

@userRouter.post("/addVideo")
def add_video(req: Video, user_id: str = Depends(get_current_user_id)):
    conversation_id = req.conversationId
    print(conversation_id);
    video_data = {"prompt": req.prompt, "url": req.url, "conversationId": conversation_id}
    result = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"videos": video_data}}
    )
    if result.modified_count == 1:
        return {"message": "Video added successfully", "conversationId": conversation_id }
    return {"error": "User not found or update failed"}

@userRouter.get("/myVideos")
def get_user_videos(user_id: str = Depends(get_current_user_id)):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "videos": user.get("videos", [])
    }

@userRouter.get("/getVideosByConversation/{conversation_id}")
def get_videos_by_conversation(conversation_id: str, user_id: str = Depends(get_current_user_id)):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    all_videos = user.get("videos", [])
    filtered = [
        {"prompt": v["prompt"], "url": v["url"]}
        for v in all_videos
        if v.get("conversationId") == conversation_id
    ]

    return {"conversationId": conversation_id, "videos": filtered}


@userRouter.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
