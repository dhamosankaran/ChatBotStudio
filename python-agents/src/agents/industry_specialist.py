from crewai import Agent
from textwrap import dedent
import os
import logging

logger = logging.getLogger(__name__)

class IndustrySpecialist:
    def create_agent(self):
        logger.info("Creating Industry Specialist agent")
        agent = Agent(
            role='Industry Specialist',
            goal='Analyze technical trends, regulations, and industry dynamics',
            backstory=dedent("""
                You are an Industry Specialist with deep knowledge of technological trends,
                regulatory frameworks, and competitive dynamics. You provide expert analysis
                of industry-specific challenges and opportunities.
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
        logger.info("Industry Specialist agent created successfully")
        return agent

    def analyze_task(self, product_name: str, context: str):
        logger.info(f"Industry Specialist analyzing task for product: {product_name}")
        task = dedent(f"""
            Analyze industry aspects of {product_name}, focusing on:
            1. Industry Structure: Key players, value chain, business models
            2. Regulatory Environment: Current regulations, upcoming changes
            3. Technology Landscape: Current state, emerging technologies
            4. Industry Challenges: Key issues, bottlenecks, solutions
            5. Future Outlook: Industry evolution, disruption potential

            Additional Context: {context}
            
            Format your response with clear sections and bullet points.
        """)
        logger.info("Industry Specialist task analysis complete")
        return task 