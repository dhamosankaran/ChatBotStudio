from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from crewai import Crew, Process, Task
from typing import Optional
import os
from dotenv import load_dotenv
import logging
import traceback
import json
from textwrap import dedent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('market_research_agents.log')
    ]
)
logger = logging.getLogger(__name__)

# Using absolute imports
from src.agents.research_manager import ResearchManager
from src.agents.market_analyst import MarketAnalyst
from src.agents.consumer_expert import ConsumerExpert
from src.agents.industry_specialist import IndustrySpecialist

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Market Research Agents API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    product_name: str
    context: str
    temperature: Optional[float] = 0.5

@app.post("/analyze")
async def analyze_market(request: AnalysisRequest):
    try:
        # Log request details
        logger.info(f"=== Starting Analysis ===")
        logger.info(f"Product Name: {request.product_name}")
        logger.info(f"Context Length: {len(request.context)} characters")
        logger.info(f"Temperature: {request.temperature}")
        
        # Verify OpenAI API key
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.error("OpenAI API key not found")
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        logger.info("OpenAI API key verified ✓")

        async def generate():
            try:
                # Initialize agents
                logger.info("=== Initializing Agents ===")
                research_manager = ResearchManager().create_agent()
                market_analyst = MarketAnalyst().create_agent()
                consumer_expert = ConsumerExpert().create_agent()
                industry_specialist = IndustrySpecialist().create_agent()
                logger.info("All agents initialized successfully ✓")

                # Create tasks for each agent
                logger.info("=== Creating Tasks ===")
                tasks = [
                    Task(
                        description=dedent(f"""
                            Analyze market opportunities and strategy for {request.product_name}.
                            Consider the following context: {request.context}
                            Provide a detailed strategic analysis with:
                            - Market opportunities
                            - Growth strategy recommendations
                            - Innovation roadmap
                            - Strategic recommendations
                        """).strip(),
                        expected_output="A detailed strategic analysis report including market opportunities, growth strategy, innovation roadmap, and recommendations.",
                        agent=research_manager
                    ),
                    Task(
                        description=dedent(f"""
                            Analyze market landscape and trends for {request.product_name}.
                            Consider the following context: {request.context}
                            Provide a comprehensive analysis including:
                            - Market size and potential
                            - Current trends and future predictions
                            - Competitive landscape analysis
                        """).strip(),
                        expected_output="A comprehensive market analysis report covering market size, trends, and competitive landscape.",
                        agent=market_analyst
                    ),
                    Task(
                        description=dedent(f"""
                            Analyze consumer behavior and preferences for {request.product_name}.
                            Consider the following context: {request.context}
                            Provide detailed insights on:
                            - Consumer preferences and behavior
                            - Adoption patterns
                            - Customer segments and needs
                        """).strip(),
                        expected_output="A detailed consumer behavior analysis report including preferences, adoption patterns, and customer segments.",
                        agent=consumer_expert
                    ),
                    Task(
                        description=dedent(f"""
                            Analyze industry trends and dynamics for {request.product_name}.
                            Consider the following context: {request.context}
                            Provide thorough analysis of:
                            - Technical trends
                            - Industry dynamics
                            - Competitive positioning
                        """).strip(),
                        expected_output="A thorough industry analysis report covering technical trends, industry dynamics, and competitive positioning.",
                        agent=industry_specialist
                    )
                ]
                logger.info("All tasks created successfully ✓")

                # Run each task individually and stream results
                for task in tasks:
                    try:
                        # Create a separate crew for each task
                        logger.info(f"=== Starting Task for {task.agent.role} ===")
                        logger.info(f"Task Description: {task.description[:200]}...")
                        logger.info(f"Expected Output: {task.expected_output}")
                        
                        single_task_crew = Crew(
                            agents=[task.agent],
                            tasks=[task],
                            process=Process.sequential,
                            verbose=True
                        )
                        
                        # Execute the task
                        logger.info(f"Executing task with {task.agent.role}...")
                        task_result = single_task_crew.kickoff()
                        logger.info(f"Task completed for {task.agent.role}")
                        
                        # Convert CrewOutput to string and get its length
                        task_result_str = str(task_result)
                        logger.info(f"Result length: {len(task_result_str)} characters")
                        logger.debug(f"Raw result type: {type(task_result)}")
                        
                        # Add agent identifier to the result
                        agent_type = task.agent.role.lower()
                        logger.info(f"Formatting output for agent type: {agent_type}")
                        
                        # Format the content with proper markdown structure
                        if "research manager" in agent_type:
                            prefix = "## Research Manager Analysis\n\n"
                        elif "market analyst" in agent_type:
                            prefix = "## Market Analyst Insights\n\n"
                        elif "consumer expert" in agent_type:
                            prefix = "## Consumer Expert Review\n\n"
                        else:
                            prefix = "## Industry Specialist Assessment\n\n"
                        
                        # Clean up the content formatting
                        content_lines = task_result_str.split('\n')
                        cleaned_lines = []
                        for line in content_lines:
                            line = line.strip()
                            if line.startswith('#'):  # Handle headers
                                cleaned_lines.append(f"\n{line}\n")
                            elif line.startswith('-'):  # Handle list items
                                cleaned_lines.append(line)
                            elif line.startswith('*'):  # Handle bold items
                                cleaned_lines.append(line)
                            elif line:  # Handle regular paragraphs
                                cleaned_lines.append(f"{line}\n")
                        
                        formatted_result = prefix + '\n'.join(cleaned_lines)
                        logger.info(f"Formatted result length: {len(formatted_result)} characters")
                        logger.debug(f"Sending chunk for {agent_type}")
                        
                        yield f"data: {json.dumps({'text': formatted_result})}\n\n"
                        
                    except Exception as e:
                        logger.error(f"Error executing task for {task.agent.role}: {str(e)}")
                        logger.error(traceback.format_exc())
                        yield f"data: {json.dumps({'error': f'Error in {task.agent.role} analysis: {str(e)}'})}\n\n"
                
            except Exception as e:
                logger.error(f"Error during streaming: {str(e)}")
                logger.error(traceback.format_exc())
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 