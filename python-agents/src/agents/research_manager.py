from crewai import Agent
from textwrap import dedent
import os
import logging

logger = logging.getLogger(__name__)

class ResearchManager:
    def create_agent(self):
        logger.info("Creating Research Manager agent")
        agent = Agent(
            role='Research Manager',
            goal='Coordinate and synthesize market research insights to provide strategic direction',
            backstory=dedent("""
                You are an experienced Research Manager with a strong background in strategic planning
                and market analysis. Your expertise lies in identifying market opportunities, coordinating
                research efforts, and providing actionable recommendations.
            """),
            tools=[],
            verbose=True,
            allow_delegation=True,
            memory=True,
            llm_config={
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": "gpt-4-turbo-preview",
                "temperature": 0.7,
                "max_tokens": 1500,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }
        )
        logger.info("Research Manager agent created successfully")
        return agent

    def analyze_task(self, product_name: str, context: str):
        logger.info(f"Research Manager analyzing task for product: {product_name}")
        task = f"Analyze {product_name} and provide strategic insights focusing on: 1. Market Opportunity: Size, target share %, and timeline 2. Growth Strategy: 3 specific growth initiatives with metrics 3. Innovation Roadmap: Key R&D priorities with timelines 4. Critical Findings: Market position, growth catalysts, risks 5. Strategic Recommendations: Quick wins, mid-term moves, long-term bets. Additional Context: {context}"
        logger.info("Research Manager task analysis complete")
        return task 