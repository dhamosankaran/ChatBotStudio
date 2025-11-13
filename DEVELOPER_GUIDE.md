# 🛠️ CitiFlow Agent Studio - Developer Implementation Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Implementation Phases](#implementation-phases)
5. [API Design](#api-design)
6. [Database Schema](#database-schema)
7. [Security Implementation](#security-implementation)
8. [Deployment Architecture](#deployment-architecture)
9. [Development Roadmap](#development-roadmap)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Vue)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐│
│  │  Studio UI │  │ Test Chat  │  │ Analytics  │  │ Version   ││
│  │  Builder   │  │ Interface  │  │ Dashboard  │  │ Control   ││
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Kong/NGINX)                     │
│                    Authentication & Rate Limiting                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services (Microservices)              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐│
│  │  Agent     │  │    RAG     │  │   Tool     │  │ Analytics ││
│  │  Service   │  │  Service   │  │  Executor  │  │  Service  ││
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐│
│  │ PostgreSQL │  │   Vector   │  │   Redis    │  │    S3     ││
│  │ (Metadata) │  │ DB (RAG)   │  │  (Cache)   │  │  (Files)  ││
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐│
│  │   OpenAI   │  │    Auth0   │  │  DataDog   │  │  PagerDuty││
│  │  /Claude   │  │   (SSO)    │  │(Monitoring)│  │  (Alerts) ││
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Stack

```yaml
Framework: React 18 with TypeScript
State Management: Redux Toolkit / Zustand
UI Library: 
  - Material-UI or Ant Design
  - Custom design system components
Styling: TailwindCSS + CSS Modules
Charts/Viz: Recharts or D3.js
Rich Text: Monaco Editor (for prompt editing)
WebSocket: Socket.io-client (for real-time updates)
Testing: Jest + React Testing Library + Cypress
Build Tool: Vite or Create React App
```

### Backend Stack

```yaml
Language: Python 3.11+ or Node.js 18+
Framework: FastAPI (Python) or Express.js (Node)
API: REST + GraphQL (Apollo Server)
WebSocket: Socket.io or native WebSockets
Task Queue: Celery (Python) or Bull (Node.js)
Message Broker: RabbitMQ or AWS SQS
ORM: SQLAlchemy (Python) or Prisma (Node)
Validation: Pydantic (Python) or Zod (Node)
Testing: pytest or Jest
Documentation: OpenAPI/Swagger
```

### Data Layer

```yaml
Primary DB: PostgreSQL 15+
  - Agent configurations
  - User data
  - Audit logs
  
Vector DB: Pinecone / Weaviate / Qdrant
  - Knowledge base embeddings
  - Semantic search
  
Cache: Redis 7+
  - Session management
  - Rate limiting
  - Response caching
  
Object Storage: AWS S3 / MinIO
  - Knowledge base documents
  - Agent exports
  - Logs
  
Time-Series DB: InfluxDB or TimescaleDB
  - Analytics data
  - Performance metrics
```

### Infrastructure

```yaml
Container: Docker + Docker Compose (dev) / Kubernetes (prod)
Orchestration: Kubernetes with Helm charts
CI/CD: GitHub Actions / GitLab CI / Jenkins
Cloud Provider: AWS / Azure / GCP
API Gateway: Kong or AWS API Gateway
Load Balancer: NGINX or AWS ALB
Monitoring: Prometheus + Grafana
Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
Tracing: Jaeger or OpenTelemetry
Secrets: HashiCorp Vault or AWS Secrets Manager
```

---

## System Components

### 1. Frontend - Studio UI

**Component Structure:**

```typescript
src/
├── components/
│   ├── Studio/
│   │   ├── Sidebar/
│   │   │   ├── ComponentPalette.tsx
│   │   │   ├── ComponentCard.tsx
│   │   │   └── AgentStatus.tsx
│   │   ├── Canvas/
│   │   │   ├── FlowCanvas.tsx
│   │   │   ├── FlowNode.tsx
│   │   │   └── FlowConnector.tsx
│   │   ├── ConfigPanel/
│   │   │   ├── LLMConfig.tsx
│   │   │   ├── RAGConfig.tsx
│   │   │   ├── ToolsConfig.tsx
│   │   │   └── AnalyticsTab.tsx
│   │   └── TestChat/
│   │       ├── ChatWindow.tsx
│   │       ├── MessageBubble.tsx
│   │       └── ThinkingIndicator.tsx
│   ├── Shared/
│   │   ├── Modal.tsx
│   │   ├── Notification.tsx
│   │   └── Loader.tsx
│   └── ...
├── services/
│   ├── api/
│   │   ├── agentService.ts
│   │   ├── ragService.ts
│   │   ├── toolService.ts
│   │   └── analyticsService.ts
│   └── websocket.ts
├── store/
│   ├── agentSlice.ts
│   ├── uiSlice.ts
│   └── userSlice.ts
├── hooks/
│   ├── useAgent.ts
│   ├── useWebSocket.ts
│   └── useAnalytics.ts
└── types/
    ├── agent.ts
    ├── rag.ts
    └── tool.ts
```

**Key Implementation Details:**

```typescript
// types/agent.ts
export interface Agent {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'staging' | 'production';
  config: AgentConfig;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AgentConfig {
  llm: LLMConfig;
  rag: RAGConfig;
  tools: ToolConfig[];
  guardrails: GuardrailConfig;
}

export interface LLMConfig {
  model: 'gpt-4' | 'claude-3' | 'custom';
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  responseFormat: 'concise' | 'moderate' | 'detailed';
}

export interface RAGConfig {
  knowledgeBases: string[];
  retrievalSettings: {
    maxDocs: number;
    relevanceThreshold: number;
    reranking: boolean;
  };
  fallbackBehavior: 'admit_unknown' | 'escalate' | 'general_guidance';
}

export interface ToolConfig {
  id: string;
  name: string;
  enabled: boolean;
  requiresAuth: boolean;
  requires2FA: boolean;
  usageStrategy: 'ai_decides' | 'always_ask' | 'auto_use';
}
```

---

### 2. Backend - Agent Service

**Service Architecture:**

```python
# services/agent_service/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── models/
│   │   ├── agent.py           # SQLAlchemy models
│   │   ├── version.py
│   │   └── deployment.py
│   ├── schemas/
│   │   ├── agent.py           # Pydantic schemas
│   │   └── config.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── agents.py      # Agent CRUD endpoints
│   │   │   ├── config.py      # Configuration endpoints
│   │   │   └── deploy.py      # Deployment endpoints
│   │   └── dependencies.py
│   ├── services/
│   │   ├── agent_builder.py   # Build agent configs
│   │   ├── validator.py       # Validate configs
│   │   └── deployer.py        # Deploy agents
│   ├── core/
│   │   ├── config.py          # App configuration
│   │   └── security.py        # Security utilities
│   └── db/
│       ├── session.py
│       └── migrations/
├── tests/
├── requirements.txt
└── Dockerfile
```

**Key Implementation:**

```python
# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import agents, config, deploy
from app.core.security import get_current_user

app = FastAPI(title="CitiFlow Agent Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router, prefix="/api/v1/agents", tags=["agents"])
app.include_router(config.router, prefix="/api/v1/config", tags=["config"])
app.include_router(deploy.router, prefix="/api/v1/deploy", tags=["deploy"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# app/api/v1/agents.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.agent import AgentCreate, AgentUpdate, Agent
from app.services.agent_builder import AgentBuilder
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=Agent)
async def create_agent(
    agent_data: AgentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new agent"""
    builder = AgentBuilder(db)
    agent = await builder.create_agent(agent_data, current_user.id)
    return agent

@router.get("/{agent_id}", response_model=Agent)
async def get_agent(
    agent_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get agent by ID"""
    agent = db.query(AgentModel).filter(
        AgentModel.id == agent_id,
        AgentModel.user_id == current_user.id
    ).first()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return agent

@router.put("/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: str,
    agent_data: AgentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update agent configuration"""
    builder = AgentBuilder(db)
    agent = await builder.update_agent(agent_id, agent_data, current_user.id)
    return agent

@router.delete("/{agent_id}")
async def delete_agent(
    agent_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete agent"""
    # Soft delete
    agent = db.query(AgentModel).filter(
        AgentModel.id == agent_id,
        AgentModel.user_id == current_user.id
    ).first()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent.deleted_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Agent deleted successfully"}


# app/services/agent_builder.py
import json
from typing import Dict, Any
from app.models.agent import Agent as AgentModel
from app.schemas.agent import AgentCreate, AgentUpdate
from app.services.validator import ConfigValidator

class AgentBuilder:
    def __init__(self, db):
        self.db = db
        self.validator = ConfigValidator()
    
    async def create_agent(self, data: AgentCreate, user_id: str) -> AgentModel:
        """Create and validate a new agent"""
        
        # Validate configuration
        validation_result = await self.validator.validate_config(data.config)
        if not validation_result.is_valid:
            raise ValueError(f"Invalid configuration: {validation_result.errors}")
        
        # Create agent record
        agent = AgentModel(
            name=data.name,
            user_id=user_id,
            config=data.config.dict(),
            status="draft",
            version="1.0.0"
        )
        
        self.db.add(agent)
        self.db.commit()
        self.db.refresh(agent)
        
        # Generate agent runtime package
        await self._build_runtime_package(agent)
        
        return agent
    
    async def _build_runtime_package(self, agent: AgentModel):
        """
        Build the runtime package for the agent
        This includes:
        1. Generating the system prompt with tool schemas
        2. Setting up RAG retrieval pipeline
        3. Configuring tool execution handlers
        """
        
        config = agent.config
        
        # Build LLM prompt with tool schemas
        system_prompt = self._build_system_prompt(
            config['llm']['systemPrompt'],
            config['tools']
        )
        
        # Build RAG pipeline configuration
        rag_pipeline = self._build_rag_pipeline(config['rag'])
        
        # Build tool execution map
        tool_executors = self._build_tool_executors(config['tools'])
        
        # Store runtime package
        runtime_package = {
            'llm_config': {
                'model': config['llm']['model'],
                'system_prompt': system_prompt,
                'temperature': config['llm']['temperature'],
                'max_tokens': config['llm']['maxTokens']
            },
            'rag_pipeline': rag_pipeline,
            'tool_executors': tool_executors,
            'guardrails': config['guardrails']
        }
        
        # Save to S3 or database
        agent.runtime_package = json.dumps(runtime_package)
        self.db.commit()
    
    def _build_system_prompt(self, base_prompt: str, tools: List[Dict]) -> str:
        """Build system prompt with tool schemas"""
        
        tool_schemas = []
        for tool in tools:
            if tool['enabled']:
                schema = self._get_tool_schema(tool['id'])
                tool_schemas.append(schema)
        
        if tool_schemas:
            tools_section = "\n\nAvailable Tools:\n"
            tools_section += json.dumps(tool_schemas, indent=2)
            return base_prompt + tools_section
        
        return base_prompt
    
    def _build_rag_pipeline(self, rag_config: Dict) -> Dict:
        """Configure RAG retrieval pipeline"""
        return {
            'knowledge_base_ids': rag_config['knowledgeBases'],
            'max_docs': rag_config['retrievalSettings']['maxDocs'],
            'threshold': rag_config['retrievalSettings']['relevanceThreshold'],
            'reranking_enabled': rag_config['retrievalSettings']['reranking']
        }
    
    def _build_tool_executors(self, tools: List[Dict]) -> Dict:
        """Build tool execution configuration"""
        executors = {}
        for tool in tools:
            if tool['enabled']:
                executors[tool['id']] = {
                    'name': tool['name'],
                    'requires_auth': tool['requiresAuth'],
                    'requires_2fa': tool['requires2FA'],
                    'strategy': tool['usageStrategy']
                }
        return executors
```

---

### 3. RAG Service

**Architecture:**

```python
# services/rag_service/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── knowledge.py       # Knowledge base CRUD
│   │       ├── documents.py       # Document upload/management
│   │       └── search.py          # Semantic search
│   ├── services/
│   │   ├── embedder.py           # Generate embeddings
│   │   ├── chunker.py            # Document chunking
│   │   ├── retriever.py          # Semantic search
│   │   └── reranker.py           # Rerank results
│   ├── vectordb/
│   │   ├── pinecone_client.py
│   │   └── weaviate_client.py
│   └── models/
│       └── knowledge_base.py
└── requirements.txt
```

**Implementation:**

```python
# app/services/retriever.py
from typing import List, Dict, Any
from openai import OpenAI
import pinecone

class RAGRetriever:
    def __init__(self, vector_db_client, embedder):
        self.vector_db = vector_db_client
        self.embedder = embedder
    
    async def retrieve(
        self,
        query: str,
        knowledge_base_ids: List[str],
        max_docs: int = 5,
        threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents from knowledge bases
        """
        
        # Generate query embedding
        query_embedding = await self.embedder.embed(query)
        
        # Search vector database
        results = []
        for kb_id in knowledge_base_ids:
            search_results = await self.vector_db.search(
                namespace=kb_id,
                vector=query_embedding,
                top_k=max_docs,
                include_metadata=True
            )
            
            # Filter by threshold
            filtered_results = [
                r for r in search_results 
                if r['score'] >= threshold
            ]
            
            results.extend(filtered_results)
        
        # Sort by relevance
        results.sort(key=lambda x: x['score'], reverse=True)
        
        # Return top results
        return results[:max_docs]
    
    async def retrieve_with_reranking(
        self,
        query: str,
        knowledge_base_ids: List[str],
        max_docs: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Retrieve with reranking for better precision
        """
        
        # Initial retrieval (get more docs than needed)
        candidates = await self.retrieve(
            query,
            knowledge_base_ids,
            max_docs=max_docs * 2,  # Get 2x candidates
            threshold=0.5  # Lower threshold
        )
        
        # Rerank using cross-encoder
        reranked = await self.reranker.rerank(query, candidates)
        
        return reranked[:max_docs]


# app/services/embedder.py
from openai import OpenAI
from typing import List

class DocumentEmbedder:
    def __init__(self, model: str = "text-embedding-3-small"):
        self.client = OpenAI()
        self.model = model
    
    async def embed(self, text: str) -> List[float]:
        """Generate embedding for text"""
        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        return response.data[0].embedding
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts"""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts
        )
        return [r.embedding for r in response.data]


# app/api/v1/documents.py
from fastapi import APIRouter, UploadFile, File, Depends
from app.services.chunker import DocumentChunker
from app.services.embedder import DocumentEmbedder
from app.vectordb.pinecone_client import PineconeClient

router = APIRouter()

@router.post("/upload")
async def upload_document(
    knowledge_base_id: str,
    file: UploadFile = File(...),
    chunker: DocumentChunker = Depends(),
    embedder: DocumentEmbedder = Depends(),
    vector_db: PineconeClient = Depends()
):
    """
    Upload and process a document
    1. Extract text
    2. Chunk into smaller pieces
    3. Generate embeddings
    4. Store in vector database
    """
    
    # Read file content
    content = await file.read()
    text = extract_text(content, file.content_type)
    
    # Chunk document
    chunks = await chunker.chunk(
        text,
        chunk_size=512,
        overlap=50
    )
    
    # Generate embeddings
    embeddings = await embedder.embed_batch([c['text'] for c in chunks])
    
    # Store in vector database
    vectors = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        vectors.append({
            'id': f"{file.filename}_{i}",
            'values': embedding,
            'metadata': {
                'text': chunk['text'],
                'source': file.filename,
                'chunk_index': i,
                'knowledge_base_id': knowledge_base_id
            }
        })
    
    await vector_db.upsert(
        namespace=knowledge_base_id,
        vectors=vectors
    )
    
    return {
        'message': 'Document uploaded successfully',
        'chunks_created': len(chunks)
    }
```

---

### 4. Tool Executor Service

**Implementation:**

```python
# services/tool_executor/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── tools.py          # Tool registry
│   │       └── execute.py        # Execute tool calls
│   ├── tools/
│   │   ├── base.py               # Base tool class
│   │   ├── banking/
│   │   │   ├── get_balance.py
│   │   │   ├── get_payments.py
│   │   │   └── get_rewards.py
│   │   └── registry.py           # Tool registry
│   └── security/
│       ├── auth.py               # Authentication
│       └── rate_limiter.py
└── requirements.txt


# app/tools/base.py
from abc import ABC, abstractmethod
from typing import Dict, Any
from pydantic import BaseModel

class ToolParameter(BaseModel):
    name: str
    type: str
    description: str
    required: bool = True
    default: Any = None

class ToolMetadata(BaseModel):
    name: str
    description: str
    parameters: List[ToolParameter]
    requires_auth: bool = True
    requires_2fa: bool = False
    rate_limit: int = 100  # requests per minute

class BaseTool(ABC):
    """Base class for all tools"""
    
    def __init__(self):
        self.metadata = self.get_metadata()
    
    @abstractmethod
    def get_metadata(self) -> ToolMetadata:
        """Return tool metadata"""
        pass
    
    @abstractmethod
    async def execute(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the tool"""
        pass
    
    def to_schema(self) -> Dict[str, Any]:
        """Convert to JSON schema for LLM"""
        return {
            "type": "function",
            "function": {
                "name": self.metadata.name,
                "description": self.metadata.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        param.name: {
                            "type": param.type,
                            "description": param.description
                        }
                        for param in self.metadata.parameters
                    },
                    "required": [
                        p.name for p in self.metadata.parameters if p.required
                    ]
                }
            }
        }


# app/tools/banking/get_balance.py
from app.tools.base import BaseTool, ToolMetadata, ToolParameter
from typing import Dict, Any
import httpx

class GetAccountBalanceTool(BaseTool):
    def get_metadata(self) -> ToolMetadata:
        return ToolMetadata(
            name="get_account_balance",
            description="Retrieve the current balance and available credit for a customer's credit card account",
            parameters=[
                ToolParameter(
                    name="account_id",
                    type="string",
                    description="The customer's account ID",
                    required=False  # Can be inferred from auth context
                )
            ],
            requires_auth=True,
            requires_2fa=False,
            rate_limit=100
        )
    
    async def execute(self, parameters: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the tool to get account balance
        Context contains: user_id, session_token, etc.
        """
        
        # Get account_id from parameters or context
        account_id = parameters.get('account_id') or context.get('account_id')
        
        if not account_id:
            raise ValueError("account_id is required")
        
        # Call internal API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://internal-api.citi.com/accounts/{account_id}/balance",
                headers={
                    "Authorization": f"Bearer {context['api_token']}",
                    "X-User-ID": context['user_id']
                }
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "data": {
                "balance": data['current_balance'],
                "available_credit": data['available_credit'],
                "credit_limit": data['credit_limit'],
                "currency": data['currency']
            }
        }


# app/tools/registry.py
from typing import Dict, Type
from app.tools.base import BaseTool
from app.tools.banking.get_balance import GetAccountBalanceTool
from app.tools.banking.get_payments import GetPaymentHistoryTool
from app.tools.banking.get_rewards import GetRewardsPointsTool

class ToolRegistry:
    """Central registry for all available tools"""
    
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self._register_tools()
    
    def _register_tools(self):
        """Register all available tools"""
        tools = [
            GetAccountBalanceTool(),
            GetPaymentHistoryTool(),
            GetRewardsPointsTool(),
            # Add more tools here
        ]
        
        for tool in tools:
            self._tools[tool.metadata.name] = tool
    
    def get_tool(self, name: str) -> BaseTool:
        """Get tool by name"""
        if name not in self._tools:
            raise ValueError(f"Tool {name} not found")
        return self._tools[name]
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """List all available tools"""
        return [tool.to_schema() for tool in self._tools.values()]
    
    async def execute_tool(
        self,
        name: str,
        parameters: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute a tool by name"""
        tool = self.get_tool(name)
        
        # Check authentication
        if tool.metadata.requires_auth and not context.get('authenticated'):
            raise PermissionError("Authentication required")
        
        # Check 2FA
        if tool.metadata.requires_2fa and not context.get('2fa_verified'):
            raise PermissionError("2FA verification required")
        
        # Execute tool
        return await tool.execute(parameters, context)


# app/api/v1/execute.py
from fastapi import APIRouter, Depends, HTTPException
from app.tools.registry import ToolRegistry
from app.security.auth import get_current_user

router = APIRouter()

@router.post("/execute/{tool_name}")
async def execute_tool(
    tool_name: str,
    parameters: Dict[str, Any],
    registry: ToolRegistry = Depends(),
    current_user = Depends(get_current_user)
):
    """Execute a tool"""
    
    context = {
        'user_id': current_user.id,
        'account_id': current_user.account_id,
        'authenticated': True,
        '2fa_verified': current_user.is_2fa_verified,
        'api_token': current_user.api_token
    }
    
    try:
        result = await registry.execute_tool(tool_name, parameters, context)
        return result
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### 5. Agent Runtime (Conversation Handler)

**This is the core execution engine that processes user messages:**

```python
# services/agent_runtime/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       └── chat.py
│   ├── runtime/
│   │   ├── executor.py           # Main execution loop
│   │   ├── llm_client.py         # LLM interaction
│   │   └── context_manager.py    # Conversation context
│   └── models/
│       └── message.py
└── requirements.txt


# app/runtime/executor.py
from typing import Dict, Any, List, AsyncGenerator
import json
from openai import OpenAI
from app.services.rag import RAGRetriever
from app.services.tools import ToolRegistry

class AgentExecutor:
    """
    Main execution engine for agents
    Handles the complete flow: RAG → LLM → Tools → Response
    """
    
    def __init__(
        self,
        agent_config: Dict[str, Any],
        rag_retriever: RAGRetriever,
        tool_registry: ToolRegistry
    ):
        self.config = agent_config
        self.rag = rag_retriever
        self.tools = tool_registry
        self.llm_client = OpenAI()
    
    async def process_message(
        self,
        message: str,
        context: Dict[str, Any],
        conversation_history: List[Dict]
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a user message through the agent pipeline
        Yields status updates for real-time UI feedback
        """
        
        # Step 1: RAG Retrieval
        yield {"type": "status", "step": "rag", "message": "Searching knowledge bases..."}
        
        relevant_docs = []
        if self.config['rag']['enabled']:
            relevant_docs = await self.rag.retrieve(
                query=message,
                knowledge_base_ids=self.config['rag']['knowledge_base_ids'],
                max_docs=self.config['rag']['max_docs']
            )
        
        yield {
            "type": "rag_complete",
            "docs_retrieved": len(relevant_docs),
            "sources": [d['metadata']['source'] for d in relevant_docs]
        }
        
        # Step 2: Build context for LLM
        yield {"type": "status", "step": "llm", "message": "AI is thinking..."}
        
        # Build messages for LLM
        messages = self._build_messages(
            message,
            relevant_docs,
            conversation_history
        )
        
        # Build tool schemas if tools are enabled
        tools = None
        if self.config['tools']['enabled']:
            tools = [
                self.tools.get_tool(t['id']).to_schema()
                for t in self.config['tools']['list']
                if t['enabled']
            ]
        
        # Step 3: Call LLM
        response = await self.llm_client.chat.completions.create(
            model=self.config['llm']['model'],
            messages=messages,
            temperature=self.config['llm']['temperature'],
            max_tokens=self.config['llm']['max_tokens'],
            tools=tools if tools else None,
            tool_choice="auto" if tools else None
        )
        
        assistant_message = response.choices[0].message
        
        # Step 4: Handle tool calls if any
        if assistant_message.tool_calls:
            yield {"type": "status", "step": "tools", "message": "Executing tools..."}
            
            tool_results = []
            for tool_call in assistant_message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)
                
                yield {
                    "type": "tool_call",
                    "tool_name": tool_name,
                    "arguments": tool_args
                }
                
                # Execute tool
                tool_result = await self.tools.execute_tool(
                    tool_name,
                    tool_args,
                    context
                )
                
                tool_results.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": tool_name,
                    "content": json.dumps(tool_result)
                })
            
            # Call LLM again with tool results
            yield {"type": "status", "step": "llm", "message": "Generating final response..."}
            
            messages.append(assistant_message)
            messages.extend(tool_results)
            
            final_response = await self.llm_client.chat.completions.create(
                model=self.config['llm']['model'],
                messages=messages,
                temperature=self.config['llm']['temperature'],
                max_tokens=self.config['llm']['max_tokens']
            )
            
            assistant_message = final_response.choices[0].message
        
        # Step 5: Return final response
        yield {
            "type": "response",
            "content": assistant_message.content,
            "metadata": {
                "model": self.config['llm']['model'],
                "rag_docs_used": len(relevant_docs),
                "tools_called": len(assistant_message.tool_calls) if assistant_message.tool_calls else 0,
                "total_tokens": response.usage.total_tokens
            }
        }
    
    def _build_messages(
        self,
        user_message: str,
        relevant_docs: List[Dict],
        history: List[Dict]
    ) -> List[Dict[str, str]]:
        """Build message list for LLM"""
        
        messages = []
        
        # System prompt
        system_prompt = self.config['llm']['system_prompt']
        
        # Add RAG context if available
        if relevant_docs:
            context = "\n\n".join([
                f"[Source: {doc['metadata']['source']}]\n{doc['metadata']['text']}"
                for doc in relevant_docs
            ])
            system_prompt += f"\n\nRelevant Context:\n{context}"
        
        messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history (last N messages)
        messages.extend(history[-10:])  # Keep last 10 messages
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        return messages


# app/api/v1/chat.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.runtime.executor import AgentExecutor
from app.services.agent import get_agent_config
import json

router = APIRouter()

@router.websocket("/ws/chat/{agent_id}")
async def chat_websocket(
    websocket: WebSocket,
    agent_id: str
):
    """
    WebSocket endpoint for real-time chat
    """
    await websocket.accept()
    
    # Load agent configuration
    agent_config = await get_agent_config(agent_id)
    
    # Initialize executor
    executor = AgentExecutor(
        agent_config=agent_config,
        rag_retriever=RAGRetriever(),
        tool_registry=ToolRegistry()
    )
    
    conversation_history = []
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            user_message = message_data['message']
            context = message_data.get('context', {})
            
            # Process message and stream updates
            async for update in executor.process_message(
                user_message,
                context,
                conversation_history
            ):
                # Send update to client
                await websocket.send_json(update)
                
                # If this is the final response, add to history
                if update['type'] == 'response':
                    conversation_history.append({
                        "role": "user",
                        "content": user_message
                    })
                    conversation_history.append({
                        "role": "assistant",
                        "content": update['content']
                    })
    
    except WebSocketDisconnect:
        print(f"Client disconnected from agent {agent_id}")
```

---

## Database Schema

```sql
-- PostgreSQL Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'builder', 'manager', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL, -- 'draft', 'staging', 'production'
    version VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    runtime_package JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_status ON agents(status);

-- Agent versions (for version control)
CREATE TABLE agent_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    version VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_description TEXT
);

CREATE INDEX idx_agent_versions_agent_id ON agent_versions(agent_id);

-- Knowledge bases
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL, -- 'active', 'updating', 'deprecated'
    document_count INTEGER DEFAULT 0,
    total_chunks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents in knowledge bases
CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_base_id UUID REFERENCES knowledge_bases(id),
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    size_bytes INTEGER,
    chunk_count INTEGER,
    s3_path VARCHAR(500),
    status VARCHAR(50), -- 'processing', 'ready', 'failed'
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tools registry
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    schema JSONB NOT NULL,
    requires_auth BOOLEAN DEFAULT TRUE,
    requires_2fa BOOLEAN DEFAULT FALSE,
    rate_limit INTEGER DEFAULT 100,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deployments
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    version VARCHAR(50) NOT NULL,
    environment VARCHAR(50) NOT NULL, -- 'staging', 'production'
    status VARCHAR(50) NOT NULL, -- 'pending', 'deploying', 'active', 'failed', 'rolled_back'
    deployed_by UUID REFERENCES users(id),
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rollback_target UUID REFERENCES deployments(id) NULL
);

-- Conversations (for analytics)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    user_id VARCHAR(255), -- Can be anonymous
    session_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    message_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0
);

-- Messages (for analytics and debugging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB, -- RAG docs used, tools called, etc.
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    event_type VARCHAR(100) NOT NULL, -- 'message', 'tool_call', 'error', 'feedback'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_agent_id ON analytics_events(agent_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- User feedback
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    message_id UUID REFERENCES messages(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Implementation Phases

### Phase 1: MVP (3 months)

**Goals:**
- Basic agent builder UI
- Simple LLM integration
- Basic RAG with 1-2 knowledge bases
- 5 pre-built tools
- Manual deployment
- Basic analytics

**Deliverables:**
1. React frontend with basic UI
2. FastAPI backend with agent CRUD
3. Pinecone integration for RAG
4. OpenAI/Claude integration
5. PostgreSQL database
6. Simple deployment script

**Team:**
- 2 Frontend developers
- 2 Backend developers
- 1 DevOps engineer
- 1 Product manager

---

### Phase 2: Production Ready (3 months)

**Goals:**
- Complete UI with all features
- Multi-model support
- Advanced RAG with reranking
- 20+ tools
- Automated deployment pipeline
- Comprehensive analytics
- Version control
- Approval workflows

**Deliverables:**
1. Complete studio UI
2. WebSocket real-time chat
3. Tool registry system
4. Deployment automation
5. Analytics dashboard
6. Version history
7. Security hardening

**Team:**
- 3 Frontend developers
- 3 Backend developers
- 2 DevOps engineers
- 1 Security engineer
- 1 Product manager

---

### Phase 3: Enterprise (3 months)

**Goals:**
- SSO integration
- Multi-tenancy
- Advanced monitoring
- A/B testing
- Cost optimization
- Multi-channel deployment
- Compliance features

**Deliverables:**
1. Auth0/Okta integration
2. Multi-tenant architecture
3. Prometheus/Grafana monitoring
4. A/B testing framework
5. Cost tracking and alerts
6. Voice/phone integration
7. Audit logging

---

## Development Estimates

### Total Time: 9-12 months

### Team Size: 10-15 people

**Breakdown:**
- Frontend: 3-4 developers
- Backend: 3-4 developers
- DevOps/Infrastructure: 2-3 engineers
- Security: 1-2 engineers
- Data/ML: 1-2 engineers
- Product/Design: 1-2 people
- QA/Testing: 1-2 engineers

### Cost Estimate

**Development Costs:**
- Personnel: $1.5M - $2.5M (9-12 months)
- Infrastructure (dev/staging): $10K-20K/month
- Third-party services: $5K-10K/month
- Total: ~$2M-$3M

**Ongoing Costs (annual):**
- Infrastructure: $200K-500K
- LLM API costs: $500K-$1M (depends on usage)
- Personnel (maintenance): $1M-$1.5M
- Total: ~$2M-$3M/year

---

## Next Steps for Developers

1. **Set up development environment**
2. **Choose technology stack** based on team expertise
3. **Start with Phase 1 MVP**
4. **Build iteratively**
5. **Get user feedback early and often**
6. **Scale based on adoption**

---

*This guide provides a comprehensive overview for developers. For more details on specific components, refer to individual service documentation.*

