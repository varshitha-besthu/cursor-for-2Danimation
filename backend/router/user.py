from fastapi import APIRouter # type: ignore
from pydantic import BaseModel# type: ignore
from typing import List
from bson import ObjectId #type : ignore
from configurations import user_collection
userRouter = APIRouter()

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class video(BaseModel):
    prompt: str
    url: str

class User(BaseModel):
    username: str
    password: str
    videos: List[video] | None

class AddVideoRequest(BaseModel):
    user_id: str
    prompt: str
    url: str
    

@userRouter.post("/signin")
def signin(user: User):
    user_dict = user.model_dump()
    result = user_collection.insert_one(user_dict)
    return {"inserted_id": str(result.inserted_id)}


@userRouter.get("/signin")
def getUsers():
    users = []
    for user in user_collection.find():
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

@userRouter.patch("/addVideo")
def add_video(req: AddVideoRequest):
    video_data = {"prompt": req.prompt, "url": req.url}

    result = user_collection.update_one(
        {"_id": ObjectId(req.user_id)},
        {"$push": {"videos": video_data}}
    )

    if result.modified_count == 1:
        return {"message": "Video added successfully"}
    else:
        return {"error": "User not found or update failed"}

