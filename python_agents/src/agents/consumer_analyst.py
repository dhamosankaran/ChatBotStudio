from .base_agent import BaseAgent
from crewai import Task, Crew
import logging

logger = logging.getLogger(__name__)

class ConsumerAnalyst(BaseAgent):
    """Consumer analyst agent responsible for consumer behavior analysis."""
    
    def __init__(self):
        super().__init__(
            role="Consumer Behavior Analyst",
            goal="Analyze consumer preferences, behaviors, and needs",
            backstory="""You are a consumer behavior expert specializing in understanding 
            customer needs, preferences, and decision-making patterns. You provide insights 
            about target demographics, buying behaviors, and consumer trends."""
        )

    def analyze_task(self, product_name: str, context: str = "") -> str:
        """Analyze consumer behavior and preferences for the given product."""
        try:
            task_description = f"""
            Conduct a comprehensive consumer analysis for {product_name}.
            
            If provided, consider this additional context: {context}
            
            Focus on:
            1. Target consumer demographics
            2. Consumer preferences and needs
            3. Buying behavior patterns
            4. Price sensitivity
            5. Consumer pain points and desires
            
            Format your response with clear sections and bullet points.
            Conclude with specific recommendations for product positioning.
            """
            
            agent = self.create_agent()
            task = Task(
                description=task_description,
                agent=agent,
                expected_output="A detailed consumer behavior analysis report with demographics, preferences, behaviors, and positioning recommendations."
            )
            crew = Crew(agents=[agent], tasks=[task], verbose=True)
            
            result = crew.kickoff()
            return self.format_output(str(result))
            
        except Exception as e:
            logger.error(f"Error in consumer analysis: {str(e)}")
            raise