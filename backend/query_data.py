from langchain.chains import ConversationalRetrievalChain
from langchain.chains.chat_vector_db.prompts import CONDENSE_QUESTION_PROMPT, QA_PROMPT
from langchain.chains.llm import LLMChain
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.vectorstores.base import VectorStore
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory


def get_chain(
    vectorstore: VectorStore) -> ConversationalRetrievalChain:
    llm = ChatOpenAI(
        temperature=0,
    )
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="question")
    qa = ConversationalRetrievalChain.from_llm(
        llm,
        vectorstore.as_retriever(),
        memory=memory,
    )
    
    # qa(question)
    
    return qa
