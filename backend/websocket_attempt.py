from query_data import get_chain
import openai
import os
import pinecone
from typing import Union
from fastapi import APIRouter, BackgroundTasks, FastAPI, File, UploadFile, WebSocket
from fastapi.responses import HTMLResponse
from langchain.document_loaders import UnstructuredFileLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI 
from PyPDF2 import PdfReader
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from dotenv import load_dotenv
from tqdm.auto import tqdm
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

def custom_generate_unique_id(route: APIRouter):
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local dev server"}],
)

origins = [
    "http://localhost:3000",
    "http://localhost:1420",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
model_name = "text-embedding-ada-002"

index_name = "langchain"
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV")
)

llm = ChatOpenAI(
    openai_api_key=openai.api_key,
    model_name='gpt-3.5-turbo',
    temperature=0.0
)

@app.get("/items/{item_id}", tags=["items"])
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

def initialize_db_if_needed():
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(
        name=index_name,
        metric='dotproduct',
        dimension=1536
    )


def ingest_docs(file: UploadFile) -> Pinecone:
    reader = PdfReader(file.file)
    contents = ""
    for page in reader.pages:
        contents += page.extract_text()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=400,
        chunk_overlap=20,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = text_splitter.create_documents([contents])
    
    texts = []
    for chunk in chunks:
        texts.append(chunk.page_content)

    embed = OpenAIEmbeddings(
        model = model_name,
    )
    
    pdf_id = str(uuid4())
    
    initialize_db_if_needed()
    docsearch = Pinecone.from_texts(texts=texts, embedding=embed, index_name=index_name, namespace=pdf_id)
    return docsearch, pdf_id
    

@app.post("/uploadfile/", tags=["upload"])
def create_upload_file(file: UploadFile, background_tasks: BackgroundTasks):

    docsearch, pdf_id = ingest_docs(file)
    background_tasks.add_task(start_websocket, docsearch)
        
    # query = "What did Anshita do at Google?"
    # docs = docsearch.similarity_search(query=query, namespace=str(pdf_id))
    
    # print()
    # for i in range(len(docs)):
    #     print(docs[i].page_content)
        
    # qa = RetrievalQA.from_chain_type(
    # llm=llm,
    # chain_type="stuff",
    # retriever=docsearch.as_retriever()
    # )
    # qa.run(query)
    
    # return {"filename": file.filename}

async def start_websocket(docsearch):
    chat_history = []
    chain = get_chain(docsearch)

    async def websocket_handler(websocket: WebSocket):
        await websocket.accept()
        while True:
            question = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {question}")
            
            # result = await chain.acall(
            #     {"question": question, "chat_history": chat_history}
            # )
            # chat_history.append((question, result["answer"]))
            # await websocket.send_text(result["answer"])
    
    app.websocket("/ws")(websocket_handler)

# @app.get("/", tags=["root"])
# async def main():
#     return {"message": "Hello World"}

@app.get("/", tags=["root"])
async def main():
    html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="/uploadfile/" enctype="multipart/form-data" method="post">
        <input name="file" type="file">
        <input type="submit">
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""
    return HTMLResponse(html)
