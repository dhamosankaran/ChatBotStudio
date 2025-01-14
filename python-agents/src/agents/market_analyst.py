from crewai import Agent
from textwrap import dedent
import os
import logging

logger = logging.getLogger(__name__)

class MarketAnalyst:
    def create_agent(self):
        logger.info("Creating Market Analyst agent")
        agent = Agent(
            role='Market Analyst',
            goal='Analyze market trends, size, and competitive landscape',
            backstory=dedent("""
                You are a skilled Market Analyst with expertise in market sizing, trend analysis,
                and competitive intelligence. You excel at identifying market opportunities and threats.
            """),
            tools=[],
            verbose=True,
            allow_delegation=True,
            memory=True,
            llm_config={
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": "gpt-4-turbo-preview",
                "temperature": 0.7,
                "max_tokens": 1200,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }
        )
        logger.info("Market Analyst agent created successfully")
        return agent

    def analyze_task(self, product_name: str, context: str):
        logger.info(f"Market Analyst analyzing task for product: {product_name}")
        task = dedent(f"""
            Analyze {product_name} from a market perspective, focusing on:
            1. Market Size & Growth: Current size and projected growth rate
            2. Competition: Key players, market share, strengths/weaknesses
            3. Market Trends: Emerging trends, consumer behavior shifts
            4. Entry Barriers: Regulatory, technological, and economic barriers
            5. Market Opportunities: Untapped segments and growth areas

            Additional Context: {context}
            
            Format your response with clear sections and bullet points.
        """)
        logger.info("Market Analyst task analysis complete")
        return task 