from crewai import Agent
from textwrap import dedent
import os
import logging
from duckduckgo_search import DDGS
from typing import List, Dict
from datetime import datetime
from langchain.tools import Tool

logger = logging.getLogger(__name__)

class ResearchManager:
    def __init__(self):
        logger.info("Research Manager initialized")

    def search_market_data(self, query: str, max_results: int = 10) -> List[Dict]:
        """
        Search for market data using DuckDuckGo
        """
        logger.info(f"Starting market data search for: {query}")
        try:
            with DDGS() as ddgs:
                logger.info("Performing multiple targeted searches...")
                
                logger.debug("Searching market analysis trends...")
                market_results = list(ddgs.text(f"{query} current market analysis trends forecast", max_results=max_results))
                logger.debug(f"Found {len(market_results)} market trend results")
                
                logger.debug("Searching competitor analysis...")
                competitor_results = list(ddgs.text(f"{query} competitors market share industry analysis", max_results=max_results))
                logger.debug(f"Found {len(competitor_results)} competitor results")
                
                logger.debug("Searching market forecasts...")
                forecast_results = list(ddgs.text(f"{query} market size growth statistics future outlook", max_results=max_results))
                logger.debug(f"Found {len(forecast_results)} forecast results")
                
                logger.debug("Searching innovation trends...")
                innovation_results = list(ddgs.text(f"{query} innovation technology trends developments", max_results=max_results))
                logger.debug(f"Found {len(innovation_results)} innovation results")
                
                logger.info("Processing and deduplicating search results...")
                all_results = []
                seen_links = set()
                
                total_results = market_results + competitor_results + forecast_results + innovation_results
                logger.debug(f"Total results before deduplication: {len(total_results)}")
                
                for result in total_results:
                    if result.get('link') not in seen_links:
                        seen_links.add(result.get('link'))
                        all_results.append({
                            'title': result.get('title', ''),
                            'link': result.get('link', ''),
                            'snippet': result.get('body', '')
                        })
                
                logger.debug(f"Results after deduplication: {len(all_results)}")
                final_results = all_results[:max_results]
                
                logger.info(f"Search complete. Found {len(final_results)} relevant results")
                return final_results
                
        except Exception as e:
            logger.error(f"Error during market data search: {e}")
            logger.exception("Full error details:")
            return []

    def create_agent(self):
        logger.info("Creating Research Manager agent")
        
        # Create the search tool
        search_tool = Tool(
            name="Search Market Data",
            func=self.search_market_data,
            description="Search for market research data and trends using DuckDuckGo. Input should be a search query string."
        )
        
        agent = Agent(
            role='Research Manager',
            goal='Coordinate and synthesize market research insights to provide strategic direction',
            backstory=dedent("""
                You are an experienced Research Manager with a strong background in strategic planning
                and market analysis. Your expertise lies in identifying market opportunities, coordinating
                research efforts, and providing actionable recommendations.
            """),
            tools=[search_tool],
            verbose=True,
            allow_delegation=False,  # Disabled delegation since we're removing context sharing
            memory=True,
            llm_config={
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": "gpt-4o",
                "temperature": 0.7,
                "max_tokens": 1500,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            }
        )
        logger.info("Research Manager agent created successfully")
        return agent 