from crewai import Agent, LLM, Task, Crew
from textwrap import dedent
import os
import logging
import re
from .exceptions import LLMError

logger = logging.getLogger(__name__)

class BaseAgent:
    """Base class for all agents to eliminate code duplication."""
    
    def __init__(self, role: str, goal: str, backstory: str):
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self._agent = None
        self._llm = None

    def create_llm(self) -> LLM:
        """Create and configure LLM instance."""
        if not self._llm:
            self._llm = LLM(
                model="gemini/gemini-2.0-flash-exp",
                temperature=0.7,
                max_tokens=1200,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                verbose=True,
                api_key=os.getenv("GEMINI_API_KEY")
            )
            if not self._llm.api_key:
                raise LLMError("GEMINI_API_KEY is not set or invalid")
        return self._llm

    def create_agent(self) -> Agent:
        """Create agent with common configuration."""
        if self._agent:
            logger.info(f"Returning existing {self.role} agent instance")
            return self._agent
            
        logger.info(f"Creating {self.role} agent")
        
        try:
            llm = self.create_llm()
            self._agent = Agent(
                role=self.role,
                goal=self.goal,
                backstory=dedent(self.backstory),
                tools=[],
                verbose=True,
                allow_delegation=False,
                memory=True,
                llm=llm
            )
            logger.info(f"{self.role} agent created successfully")
            return self._agent
        except Exception as e:
            logger.error(f"Error creating {self.role} agent: {str(e)}")
            raise

    def format_output(self, content: str) -> str:
        """Standardize output format for all agents."""
        if not content:
            return ""
        try:
            # Clean and remove extra whitespace
            cleaned_content = dedent(content).strip()

            # Remove the raw='...' or raw="..." section if exists
            cleaned_content = re.sub(r"raw=['\"](.+?)['\"]", "", cleaned_content).strip()
        
            # Remove tuple wrapping like ('content', ) if exists
            cleaned_content = re.sub(r"^\('([^)]*)',\s*\)$", r"\1", cleaned_content).strip()

            # Remove any outer quotes
            cleaned_content = cleaned_content.strip('"\'')

            return cleaned_content
        
        except Exception as e:
            logger.error(f"Error formatting output: {str(e)}")
            return ""

    def analyze_task(self, product_name: str, context: str) -> str:
        """Base method for analysis task - should be overridden by subclasses."""
        raise NotImplementedError("Subclasses must implement analyze_task method")