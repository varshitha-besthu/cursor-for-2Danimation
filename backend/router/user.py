
from fastapi import APIRouter,HTTPException # type: ignore
from pydantic import BaseModel# type: ignore
from typing import List, Optional
from bson import ObjectId #type : ignore
from configurations import user_collection
userRouter = APIRouter()
from fastapi import Response
from auth import create_access_token
from middleware import get_current_user_id
from fastapi import Depends

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


# from fastapi import Response, HTTPException
# from bson import ObjectId
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


# @userRouter.get("/signin")
# def getUsers():
#     users = []
#     for user in user_collection.find():
#         user["_id"] = str(user["_id"])
#         users.append(user)
#     return users

@userRouter.post("/addVideo")
def add_video(req: Video, user_id: str = Depends(get_current_user_id)):
    video_data = {"prompt": req.prompt, "url": req.url}
    result = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"videos": video_data}}
    )
    if result.modified_count == 1:
        return {"message": "Video added successfully"}
    return {"error": "User not found or update failed"}

@userRouter.get("/myVideos")
def get_user_videos(user_id: str = Depends(get_current_user_id)):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "videos": user.get("videos", [])
    }
