from .base_agent import BaseAgent
from crewai import Task, Crew
import logging

logger = logging.getLogger(__name__)

class MarketAnalyst(BaseAgent):
    """Market analyst agent responsible for market research."""
    
    def __init__(self):
        super().__init__(
            role="Market Research Analyst",
            goal="Analyze market trends and opportunities for products",
            backstory="""You are an experienced market research analyst with expertise in 
            identifying market opportunities, analyzing competition, and understanding consumer behavior.
            You provide detailed insights about market size, growth potential, and key trends."""
        )

    def analyze_task(self, product_name: str, context: str = "") -> str:
        """Analyze market opportunities for the given product."""
        try:
            task_description = f"""
            Conduct a comprehensive market analysis for {product_name}.
            
            If provided, consider this additional context: {context}
            
            Focus on:
            1. Market size and growth potential
            2. Key market trends
            3. Target market segments
            4. Competitive landscape
            5. Market opportunities and challenges
            
            Format your response with clear sections and bullet points.
            Conclude with specific recommendations.
            """
            
            agent = self.create_agent()
            task = Task(
                description=task_description,
                agent=agent,
                expected_output="A comprehensive market analysis report with market size, trends, competition, and recommendations."
            )
            crew = Crew(agents=[agent], tasks=[task], verbose=True)
            
            result = crew.kickoff()
            return self.format_output(str(result))
            
        except Exception as e:
            logger.error(f"Error in market analysis: {str(e)}")
            raise