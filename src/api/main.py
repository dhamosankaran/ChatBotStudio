from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from crewai import Agent, Task, Crew
from textwrap import dedent
import os
import logging
import json

from agents.market_analyst import MarketAnalyst
from agents.consumer_expert import ConsumerExpert
from agents.industry_specialist import IndustrySpecialist
from agents.research_manager import ResearchManager

app = FastAPI()

async def process_market_research(request_data: dict) -> StreamingResponse:
    try:
        product_name = request_data.get("product_name", "")
        context = request_data.get("context", "")

        # Initialize research manager for search capabilities
        research_manager = ResearchManager()
        search_tool = research_manager.create_agent().tools[0]

        # Initialize agents
        market_agent = MarketAnalyst().create_agent()
        consumer_agent = ConsumerExpert().create_agent()
        industry_agent = IndustrySpecialist().create_agent()

        # Add search tool to each agent
        for agent in [market_agent, consumer_agent, industry_agent]:
            agent.tools = [search_tool]

        # Create tasks
        market_task = Task(
            description=dedent(f"""
                Analyze {product_name} from a market perspective, focusing on:
                - Market Size & Growth: Current valuation, growth rates, segmentation
                - Competition: Key players, market share, competitive dynamics
                - Market Trends: Current and emerging trends, consumer shifts
                - Entry Barriers: Regulatory landscape, market access challenges
                - Market Opportunities: Untapped segments, growth areas
                
                Additional Context: {context}
                
                Use the search tool to gather current market data and statistics.
            """).strip(),
            agent=market_agent
        )

        consumer_task = Task(
            description=dedent(f"""
                Analyze consumer aspects of {product_name}, focusing on:
                - Target Demographics: Customer segments, characteristics, profiles
                - Consumer Behavior: Purchase patterns, decision factors
                - User Experience: Pain points, satisfaction drivers
                - Brand Perception: Positioning, sentiment, loyalty
                - Future Trends: Evolving needs, preferences, adoption barriers
                
                Additional Context: {context}
                
                Use the search tool to gather current consumer insights and trends.
            """).strip(),
            agent=consumer_agent
        )

        industry_task = Task(
            description=dedent(f"""
                Analyze industry aspects of {product_name}, focusing on:
                - Industry Structure: Key players, value chain, business models
                - Regulatory Environment: Current and upcoming regulations
                - Technology Landscape: Current stack, emerging technologies
                - Industry Challenges: Bottlenecks, constraints, opportunities
                - Future Outlook: Evolution, disruption potential, growth drivers
                
                Additional Context: {context}
                
                Use the search tool to gather current industry data and regulatory information.
            """).strip(),
            agent=industry_agent
        )

        # Create and run crew
        crew = Crew(
            agents=[market_agent, consumer_agent, industry_agent],
            tasks=[market_task, consumer_task, industry_task],
            verbose=True
        )

        async def stream_results():
            result = crew.kickoff()
            yield json.dumps({"result": result})

        return StreamingResponse(
            stream_results(),
            media_type="text/event-stream"
        )

    except Exception as e:
        logging.error(f"Error in market research processing: {str(e)}")
        raise

@app.post("/analyze")
async def analyze(request: Request):
    try:
        data = await request.json()
        return await process_market_research(data)
    except Exception as e:
        logging.error(f"Error in analyze endpoint: {str(e)}")
        return {"error": str(e)}

@app.post("/api/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        return await process_market_research(data)
    except Exception as e:
        logging.error(f"Error in chat endpoint: {str(e)}")
        return {"error": str(e)} 