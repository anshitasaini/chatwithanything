from abc import ABC, abstractmethod
from uuid import uuid4
from fastapi import UploadFile

from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from PyPDF2 import PdfReader
from langchain.schema import Document

import requests
import os

class AbstractUploadSource(ABC):
    def __init__(self) -> None:
        self.embeddings = OpenAIEmbeddings(
            client=None,
            model="text-embedding-ada-002",
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=400,
            chunk_overlap=20,
            length_function=len,
            separators=["\n\n", "\n", " ", ""],
        )
        self.source_id: str | None = None

    def ingest(self) -> str:
        if self.source_id is None:
            raise ValueError("Source ID is None")
        split_documents = self.create_documents()

        Pinecone.from_documents(
            documents=split_documents,
            embedding=self.embeddings,
            index_name="langchain-index",
            namespace=self.source_id,
        )
        return self.source_id

    @abstractmethod
    def create_documents(self) -> list[Document]:
        pass


class CodeUploadSource(AbstractUploadSource):
    def __init__(self, repo_url: str) -> None:
        super().__init__()
        self.repo_url = repo_url
        self.source_id = f"repo-{uuid4()}"
        print(self.source_id)
        self.repo_data = [[], []]

    def fetch_repo_contents(self, base_url):
        headers = {'Authorization': os.getenv("GITHUB_TOKEN")}
        # headers = {}
        response = requests.get(base_url, headers=headers)
        print(base_url)
        if response.status_code == 200:
            repo_contents = response.json()
        else:
            print(response.reason)
            print(f"Failed to fetch repository contents. Status code: {response.status_code}")
            return {}

        for item in repo_contents:
            if item['type'] == 'file':
                file_name = item['name']
                download_url = item['download_url']
                
                response = requests.get(download_url, headers=headers)
                if response.status_code == 200:
                    code_content = response.text
                else:
                    print(f"Failed to fetch code for {file_name}. Status code: {response.status_code}")
                    continue
                
                self.repo_data[0].append(code_content)
                self.repo_data[1].append({"filename": file_name, "file_request_url": download_url})
            
            elif item["type"] == "dir":
                dir_name = item['name']
                # Recursively fetch contents of the directory and update repo_data
                self.fetch_repo_contents(item['url'])
        
    def create_documents(self) -> list[Document]:
        repo_info = self.repo_url.split("github.com/")[1].split("/")
        self.fetch_repo_contents(f"https://api.github.com/repos/" + repo_info[0] + "/" + repo_info[1] + "/contents")
        for i in self.repo_data[1]:
            print(i)
        return self.text_splitter.create_documents(texts=self.repo_data[0], metadatas=self.repo_data[1])


class VideoUploadSource(AbstractUploadSource):
    def __init__(self, video_id: str) -> None:
        super().__init__()
        self.video_id = video_id

    def create_documents(self) -> list[Document]:
        contents = ''
        split_documents = self.text_splitter.create_documents([contents])
    

class PDFUploadSource(AbstractUploadSource):
    def __init__(self, file: UploadFile) -> None:
        super().__init__()
        self.file = file
        self.source_id = f"pdf-{uuid4()}"

    def create_documents(self) -> list[Document]:
        reader = PdfReader(self.file.file)
        contents = "".join(page.extract_text() for page in reader.pages)
        split_documents = self.text_splitter.create_documents([contents])
        return split_documents


class ChatQuery:
    def __init__(self, source_id: str) -> None:
        self.embeddings = OpenAIEmbeddings(
            client=None,
            model="text-embedding-ada-002",
        )
        self.llm = ChatOpenAI(client=None, model="gpt-3.5-turbo", temperature=0)
        self.vectorstore = Pinecone.from_existing_index(
            index_name="langchain-index", embedding=self.embeddings, namespace=source_id
        )
        self.qa = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
            return_source_documents=True,
        )

    def ask(self, query: str, history: list) -> str:
        result = self.qa(
            {
                "question": query,
                "chat_history": history,
            }
        )

        source_doc = Document(page_content="",metadata={}) if len(result["source_documents"]) == 0 else result["source_documents"][0]
        return result["answer"], source_doc
