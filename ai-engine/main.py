import os
import json
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
from dotenv import load_dotenv
# LangChain & Gemini Integrations
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load variables dari file .env ke environment system
load_dotenv()

app = FastAPI(title="MotoMind AI Engine")

# Setup CORS (Cross-Origin Resource Sharing)
# Penting agar Frontend lo (Vite) bisa akses API ini meskipun beda port/domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di produksi, ini harus spesifik ke domain frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS (Modul 1: The Contract) ---
# Kita pake Pydantic BaseModel untuk validasi data yang masuk.
# Kalau Habib ngirim 'history' tapi formatnya bukan list of dict, FastAPI otomatis nolak.
class ChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []
    document_id: Optional[str] = None

# --- INITIALIZATION (Modul 2: Brain Setup) ---
# Temperature 0.2: Kita mau AI yang teknis & faktual, bukan yang 'halu' kreatif.
llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview",
    streaming=True,
    temperature=0.2,
    convert_system_message_to_human=True # Mengatasi limitasi beberapa versi API Gemini
)

# --- ENDPOINTS: BASIC ---

@app.get("/")
async def root():
    """Endpoint pengecekan dasar via browser"""
    return {
        "message": "MotoMind AI Engine is Running",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    """Endpoint untuk Docker atau Load Balancer ngecek status service"""
    return {"status": "online", "engine": "Gemini 1.5 Flash", "protocol": "SSE"}

# --- CORE LOGIC: STREAMING GENERATOR (Modul 3: The Pulse) ---
async def generate_chat_stream(query: str, history: List[dict]):
    """
    Generator function menggunakan Server-Sent Events (SSE).
    Setiap kata yang diproduksi Gemini langsung dikirim ke user tanpa nunggu selesai.
    """
    try:
        # Menentukan identitas AI
        messages = [
            SystemMessage(content=""),
            HumanMessage(content=query)
        ]

        # astream: Async Stream. Ini yang bikin teks lo muncul satu per satu di UI.
        async for chunk in llm.astream(messages):
            if chunk and chunk.content:
                payload = json.dumps({"type": "text", "content": chunk.content})
                yield f"data: {payload}\n\n"
        
        # Penanda bahwa stream sudah berakhir
        yield "data: [DONE]\n\n"

    except asyncio.CancelledError:
        print("[INFO] Koneksi diputus oleh klien.")
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        error_payload = json.dumps({"type": "error", "message": "Internal AI Engine Error"})
        yield f"data: {error_payload}\n\n"

# --- ENDPOINTS: AI LOGIC ---

@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    """
    Endpoint utama. Habib akan melakukan POST ke sini.
    StreamingResponse: Ngasih tau FastAPI kalau kita nggak ngirim JSON biasa, tapi stream.
    """
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing!")
        
    return StreamingResponse(
        generate_chat_stream(req.query, req.history),
        media_type="text/event-stream"
    )

@app.post("/ingest")
async def ingest_document(payload: dict = Body(...)):
    """Placeholder untuk logic RAG (Fase berikutnya)"""
    return {"status": "success", "message": "Indexing placeholder"}

if __name__ == "__main__":
    import uvicorn
    # 0.0.0.0 agar bisa diakses di dalam network Docker
    uvicorn.run(app, host="0.0.0.0", port=8000)