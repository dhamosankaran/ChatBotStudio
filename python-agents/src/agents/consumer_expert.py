from crewai import Agent
from textwrap import dedent
import os
import logging

logger = logging.getLogger(__name__)

class ConsumerExpert:
    def create_agent(self):
        logger.info("Creating Consumer Expert agent")
        agent = Agent(
            role='Consumer Expert',
            goal='Analyze consumer behavior, preferences, and adoption patterns',
            backstory=dedent("""
                You are a Consumer Behavior Expert specializing in understanding customer needs,
                preferences, and decision-making patterns. You provide deep insights into consumer psychology.
            """),
            tools=[],
            verbose=True,
            allow_delegation=True,
            memory=True,
            llm_config={
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": "gpt-4o",
                "temperature": 0.7,
                "max_tokens": 1200,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }
        )
        logger.info("Consumer Expert agent created successfully")
        return agent

    def analyze_task(self, product_name: str, context: str):
        logger.info(f"Consumer Expert analyzing task for product: {product_name}")
        task = dedent(f"""
            Analyze consumer aspects of {product_name}, focusing on:
            1. Target Demographics: Key customer segments and characteristics
            2. Consumer Behavior: Purchase patterns, decision factors
            3. User Experience: Pain points, satisfaction drivers
            4. Brand Perception: Current positioning, sentiment analysis
            5. Future Trends: Evolving consumer needs and preferences

            Additional Context: {context}
            
            Format your response with clear sections and bullet points.
        """)
        logger.info("Consumer Expert task analysis complete")
        return task 