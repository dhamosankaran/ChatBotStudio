from .base_agent import BaseAgent
from crewai import Task, Crew
import logging

logger = logging.getLogger(__name__)

class IndustryAnalyst(BaseAgent):
    """Industry analyst agent responsible for industry analysis."""
    
    def __init__(self):
        super().__init__(
            role="Industry Analyst",
            goal="Analyze industry dynamics, regulations, and technological trends",
            backstory="""You are an industry expert specializing in analyzing industry structures,
            regulatory environments, and technological developments. You provide insights about
            industry trends, compliance requirements, and technological disruptions."""
        )

    def analyze_task(self, product_name: str, context: str = "") -> str:
        """Analyze industry landscape for the given product."""
        try:
            task_description = f"""
            Conduct a comprehensive industry analysis for {product_name}.
            
            If provided, consider this additional context: {context}
            
            Focus on:
            1. Industry structure and dynamics
            2. Regulatory environment and compliance
            3. Technological trends and disruptions
            4. Supply chain considerations
            5. Industry best practices and standards
            
            Format your response with clear sections and bullet points.
            Conclude with specific recommendations for industry positioning.
            """
            
            agent = self.create_agent()
            task = Task(
                description=task_description,
                agent=agent,
                expected_output="A comprehensive industry analysis report with regulatory insights, technological trends, and strategic positioning recommendations."
            )
            crew = Crew(agents=[agent], tasks=[task], verbose=True)
            
            result = crew.kickoff()
            return self.format_output(str(result))
            
        except Exception as e:
            logger.error(f"Error in industry analysis: {str(e)}")
            raise