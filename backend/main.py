import openai
import os
import pinecone
import requests
from typing import Union
from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm import PDFUploadSource, CodeUploadSource, ChatQuery
from youtube_transcript_api import YouTubeTranscriptApi
from uuid import uuid4
from fastapi.routing import APIRoute

load_dotenv()


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local dev server"}],
)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3001/chat/",
    "http://localhost:3001/chat/code/",
    "http://localhost:1420",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
model_name = "text-embedding-ada-002"

index_name = "langchain-index"
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV")  # type: ignore
)


@app.get("/items/{item_id}", tags=["items"])
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/code/", tags=["code"])
def get_file(file_request_url: str):
    headers = {'Authorization': os.getenv("GITHUB_TOKEN")}
    response = requests.get(file_request_url, headers=headers)
    if response.status_code == 200:
        return response.text
    return "Failed to fetch code"

def initialize_db_if_needed():
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(name=index_name, metric="dotproduct", dimension=1536)


class SourceInfo(BaseModel):
    source_id: str
    num_bytes: int
    filename: str
    display_name: str

class UploadOutSchema(BaseModel):
    type: str
    sourceInfo: SourceInfo


class VideoInfo(BaseModel):
    video_id: str
    transcript: str
    
class VideoUploadOutSchema(BaseModel):
    type: str
    videoInfo: VideoInfo


class RepoInfo(BaseModel):
    source_id: str
    repo_url: str
    name: str
    
class RepoUploadOutSchema(BaseModel):
    type: str
    repoInfo: RepoInfo

@app.post("/uploadfile/", tags=["upload"], response_model=UploadOutSchema)
def create_upload_file(file: UploadFile):
    source_id = PDFUploadSource(file).ingest()

    return UploadOutSchema(
        type="ok",
        sourceInfo=SourceInfo(
            source_id=source_id,
            num_bytes=file.size if file.size is not None else 0,
            filename=file.filename if file.filename is not None else "",
            display_name=file.filename if file.filename is not None else "",
        ),
    )


@app.post("/uploadvideo/", tags=["chat"], response_model=VideoUploadOutSchema)
def generate_transcript(video_url: str):
    source_id, transcript = VideoUploadSource(video_url).ingest()
    
    # parse id from url
    video_id = video_url.split("=")[1]
    
    source_id = f"video-{uuid4()}"
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    script = ""

    for text in transcript:
        t = text["text"]
        if t != '[Music]':
            script += t + " "
            
    print(script)
		
    return VideoUploadOutSchema(
        type="video",
        videoInfo=VideoInfo(
            video_id=source_id,
            transcript=script
        ),
    )

@app.post("/uploadcode/", tags=["upload"], response_model=RepoUploadOutSchema)
def upload_code(repo_url: str):
    source_id = CodeUploadSource(repo_url).ingest()

    return RepoUploadOutSchema(
        type="ok",
        repoInfo=RepoInfo(
            source_id=source_id,
            repo_url=repo_url,
            name=repo_url.split("/")[-1]
        ),
    )

class ChatSessionSchema(BaseModel):
    type: str
    chat_id: str
    source_id: str


class ChatMessageSchema(BaseModel):
    message: str
    sender: str

class ChatInSchema(BaseModel):
    query: str
    chat_session: ChatSessionSchema
    history: list[ChatMessageSchema]

class ChatResponse(BaseModel):
    answer: str
    source_content: str
    source_metadata: dict

@app.post("/chat/", tags=["chat"], response_model=ChatResponse)
def send_chat_message(chat_in: ChatInSchema):
    source_id = chat_in.chat_session.source_id
    history = chat_in.history
    query_obj = ChatQuery(source_id)
    chat_history = [(history[i].message, history[i + 1].message) for i in range(1, len(history) - 1, 2)]
    answer, source = query_obj.ask(chat_in.query, chat_history)
    return ChatResponse(
        answer=answer,
        source_content=source.page_content,
        source_metadata=source.metadata,
    )

@app.get("/", tags=["root"])
async def main():
    return {"message": "Hello World"}
