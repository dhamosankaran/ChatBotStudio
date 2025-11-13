# 🚀 Running the End-to-End Prototype

This guide shows you how to run the complete working prototype with backend API and frontend integration.

## What You'll Build

A fully functional agent studio where you can:
1. ✅ Create agents through a web interface
2. ✅ Configure LLM settings (no code!)
3. ✅ Enable knowledge bases (RAG)
4. ✅ Enable tools/APIs
5. ✅ Test chat in real-time
6. ✅ See the complete pipeline: RAG → LLM → Tools → Response

---

## Quick Start (5 minutes)

### Step 1: Start the Backend

```bash
# Terminal 1: Backend
cd Backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

✅ Backend runs at: http://localhost:8000  
✅ API Docs: http://localhost:8000/docs

### Step 2: Open the Frontend

```bash
# Open in browser
open Frontend/agent-builder-integration.html
# Or just double-click the file
```

### Step 3: Build Your First Agent

1. **In the web interface:**
   - Fill in agent name: "My Test Agent"
   - Write a prompt: "You are a helpful assistant"
   - Select knowledge bases (both checked by default)
   - Select tools (all checked by default)
   - Click "Create Agent"

2. **Test the chat:**
   - Select your agent from dropdown
   - Type: "What is my balance?"
   - Watch the magic happen! 🎉

---

## Detailed Setup

### Prerequisites

```bash
# Check Python version
python3 --version  # Should be 3.9+

# Check if pip is installed
pip3 --version
```

### Backend Setup (Detailed)

```bash
# Navigate to Backend directory
cd /Users/kalaidhamu/Desktop/KalaiDhamu/LLM/General/LLM_Studio/Backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Mac/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process
# INFO:     Application startup complete.
```

### Frontend Setup

**Option 1: Open directly in browser**
```bash
# Navigate to Frontend directory
cd /Users/kalaidhamu/Desktop/KalaiDhamu/LLM/General/LLM_Studio/Frontend

# Open in browser
open agent-builder-integration.html
```

**Option 2: Use a local server (avoids CORS issues)**
```bash
# Python 3
python3 -m http.server 3000

# Then open: http://localhost:3000/agent-builder-integration.html
```

---

## Architecture of This Prototype

```
┌─────────────────────────────────────────────────────┐
│            agent-builder-integration.html           │
│              (Your Web Browser)                     │
│  • Create agents                                    │
│  • Configure settings                               │
│  • Test chat                                        │
└─────────────────────────────────────────────────────┘
                          ↓ HTTP/REST
┌─────────────────────────────────────────────────────┐
│                main.py (FastAPI)                    │
│                (Backend Server)                     │
│  • Agent CRUD endpoints                             │
│  • Chat processing                                  │
│  • RAG retrieval (mocked)                          │
│  • Tool execution (mocked)                          │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│            In-Memory Database                       │
│  • Agents configuration                             │
│  • Knowledge bases (2 pre-loaded)                   │
│  • Tools (4 pre-configured)                         │
└─────────────────────────────────────────────────────┘
```

---

## Testing the Prototype

### Test 1: Create an Agent via API

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "config": {
      "llm": {
        "model": "gpt-4",
        "system_prompt": "You are helpful.",
        "temperature": 0.2,
        "max_tokens": 1000,
        "response_format": "moderate"
      },
      "rag": {
        "enabled": true,
        "knowledge_base_ids": ["kb-credit-cards"],
        "max_docs": 5,
        "relevance_threshold": 0.7,
        "reranking": false
      },
      "tools": []
    }
  }'
```

### Test 2: Chat with the Agent

```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is my balance?",
    "agent_id": "agent-YOUR-ID-HERE"
  }'
```

### Test 3: Use the Web Interface

1. Open `Frontend/agent-builder-integration.html`
2. Create agent (click button)
3. Send message: "What rewards programs do you offer?"
4. Watch the response flow:
   - 🔍 Searching knowledge bases...
   - 🧠 Generating response...
   - ✅ Complete response with sources

---

## What's Working vs What's Mocked

### ✅ Fully Functional:

1. **FastAPI Backend**
   - All REST endpoints working
   - WebSocket support
   - Request validation
   - Error handling

2. **Agent Management**
   - Create, read, update, delete agents
   - Configuration storage
   - Version tracking

3. **Pipeline Orchestration**
   - RAG → LLM → Tools flow
   - Step-by-step processing
   - Status updates

4. **Frontend Integration**
   - Agent builder UI
   - Real-time chat
   - API integration
   - Status indicators

### 🎭 Mocked (For Demo):

1. **LLM Responses**
   - Using rule-based logic
   - **To make real:** Add OpenAI/Claude API

2. **RAG Retrieval**
   - Using keyword matching
   - **To make real:** Add Pinecone/Weaviate + embeddings

3. **Tool Execution**
   - Returning mock data
   - **To make real:** Connect to actual banking APIs

4. **Database**
   - In-memory storage
   - **To make real:** Add PostgreSQL

---

## Understanding the Code

### Backend Structure

```python
Backend/
├── main.py              # ← START HERE
│   ├── Data Models (Pydantic)
│   ├── In-Memory Database
│   ├── Business Logic
│   │   ├── AgentBuilder
│   │   ├── RAGRetriever
│   │   ├── ToolExecutor
│   │   └── AgentExecutor
│   └── API Endpoints
│       ├── /api/v1/agents
│       ├── /api/v1/knowledge-bases
│       ├── /api/v1/tools
│       └── /api/v1/chat
├── requirements.txt
└── README.md
```

### Key Classes

**AgentBuilder** - Manages agent lifecycle
```python
class AgentBuilder:
    @staticmethod
    def create_agent(data: AgentCreate) -> Dict:
        # Creates and stores agent configuration
```

**RAGRetriever** - Handles knowledge base search
```python
class RAGRetriever:
    @staticmethod
    async def retrieve(query, kb_ids, max_docs) -> List[Dict]:
        # Returns relevant documents
```

**ToolExecutor** - Executes tools securely
```python
class ToolExecutor:
    @staticmethod
    async def execute_tool(tool_id, params, context) -> Dict:
        # Calls tool and returns result
```

**AgentExecutor** - Orchestrates everything
```python
class AgentExecutor:
    async def process_message(message, context) -> Dict:
        # RAG → LLM → Tools → Response
```

### Frontend Structure

```html
Frontend/
└── agent-builder-integration.html
    ├── HTML Structure
    │   ├── Agent Builder Panel
    │   └── Test Chat Panel
    ├── CSS Styling
    └── JavaScript Logic
        ├── createAgent()    # Creates agent via API
        ├── sendMessage()    # Sends chat message
        ├── listAgents()     # Lists all agents
        └── API integration
```

---

## Common Issues & Solutions

### Issue 1: "Connection refused" in frontend

**Problem:** Backend not running

**Solution:**
```bash
# Make sure backend is running in Terminal 1
cd Backend
python main.py
```

### Issue 2: "CORS error" in browser console

**Problem:** CORS not configured

**Solution:** Already configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    ...
)
```

### Issue 3: Can't install dependencies

**Problem:** Wrong Python version or pip not installed

**Solution:**
```bash
# Use Python 3.9+
python3 --version

# Upgrade pip
python3 -m pip install --upgrade pip

# Install requirements again
pip install -r requirements.txt
```

### Issue 4: Port 8000 already in use

**Solution:**
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn main:app --port 8001
# Then update frontend: const API_BASE = 'http://localhost:8001';
```

---

## Next Steps: Making It Production-Ready

### 1. Add Real LLM Integration

```python
# Install OpenAI SDK
pip install openai

# In main.py
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
)
```

### 2. Add Vector Database for RAG

```python
# Install Pinecone
pip install pinecone-client

# Initialize
import pinecone
pinecone.init(api_key="your-api-key")
index = pinecone.Index("knowledge-bases")

# Search
results = index.query(vector=embedding, top_k=5)
```

### 3. Add PostgreSQL Database

```python
# Install SQLAlchemy + psycopg2
pip install sqlalchemy psycopg2-binary

# Create engine
from sqlalchemy import create_engine
engine = create_engine("postgresql://user:pass@localhost/citiflow")
```

### 4. Add Authentication

```python
# Install Auth libraries
pip install python-jose[cryptography] passlib[bcrypt]

# Add OAuth2
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```

### 5. Deploy to Cloud

```bash
# Dockerize
docker build -t citiflow-backend .
docker run -p 8000:8000 citiflow-backend

# Deploy to AWS/GCP/Azure
# Use Kubernetes for orchestration
```

---

## Development Tips

### Hot Reload

```bash
# Backend auto-reloads on code changes
uvicorn main:app --reload
```

### Debug Mode

```python
# Add debug prints
print(f"Processing message: {message}")
print(f"Retrieved {len(docs)} documents")
```

### Test with Postman

1. Import: http://localhost:8000/docs (OpenAPI spec)
2. Test all endpoints visually
3. Save requests for later

### View Logs

```bash
# Backend logs show in terminal
# Look for errors/warnings
# Check request/response details
```

---

## Project Structure

```
LLM_Studio/
├── Backend/
│   ├── main.py                  ← Backend API (FastAPI)
│   ├── requirements.txt
│   └── README.md
├── Frontend/
│   └── agent-builder-integration.html  ← Web interface
├── Prototype/
│   ├── index.html              ← Documentation hub
│   ├── citi-agent-studio-enhanced.html
│   ├── getting-started-guide.html
│   ├── DEVELOPER_GUIDE.md
│   └── architecture-diagram.html
└── RUN_PROTOTYPE.md            ← This file
```

---

## Success Criteria

### ✅ Backend is working when:
- `curl http://localhost:8000/health` returns success
- `/docs` page loads
- Can create an agent via API

### ✅ Frontend is working when:
- Page loads without errors
- "Backend: Connected ✅" shows
- Can create agent through UI
- Can send chat messages

### ✅ E2E is working when:
- Create agent → Select agent → Send message → Get response
- Response shows RAG docs and/or tool results
- All status updates appear correctly

---

## Learn More

- **API Documentation**: http://localhost:8000/docs
- **Developer Guide**: `Prototype/DEVELOPER_GUIDE.md`
- **Architecture**: `Prototype/architecture-diagram.html`
- **Getting Started**: `Prototype/getting-started-guide.html`

---

## Questions?

**Backend not starting?**
- Check Python version (3.9+)
- Check if port 8000 is free
- Look at error messages in terminal

**Frontend not connecting?**
- Check if backend is running
- Check browser console for errors
- Verify API_BASE URL is correct

**Chat not working?**
- Make sure you created an agent
- Make sure you selected an agent
- Check backend logs for errors

---

**🎉 Congratulations!** You now have a working prototype that demonstrates the complete Agent Studio architecture from frontend to backend!

This is a **simplified but functional** implementation. For production, you'll need to:
- Replace mocked LLM with real API calls
- Replace keyword search with vector similarity
- Replace in-memory DB with PostgreSQL
- Add real authentication & authorization
- Add comprehensive error handling
- Deploy to cloud infrastructure

**But the core concepts are all here and working!** 🚀

