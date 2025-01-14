import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart2, Users, Lightbulb, Search } from 'lucide-react'

// Define agents first
const agents = [
  {
    id: 'manager',
    title: 'Research Manager',
    description: 'Strategy & Coordination',
    icon: BarChart2,
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 'market',
    title: 'Market Analyst',
    description: 'Trends & Competition',
    icon: Search,
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'consumer',
    title: 'Consumer Expert',
    description: 'Behavior & Segments',
    icon: Users,
    color: 'bg-violet-50',
    iconColor: 'text-violet-600'
  },
  {
    id: 'industry',
    title: 'Industry Specialist',
    description: 'Technical Analysis',
    icon: Lightbulb,
    color: 'bg-amber-50',
    iconColor: 'text-amber-600'
  }
]

export function ResearchResults({ content }: { content: string }) {
  const [selectedTab, setSelectedTab] = React.useState('manager')

  const formatContent = (content: string): string => {
    if (!content) return ''

    // Enhanced content formatting
    const paragraphs = content.split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)

    const formattedParagraphs = paragraphs.map(p => {
      // Handle section headers (e.g., "### Industry Analysis Report on AI Agents")
      if (p.startsWith('###')) {
        return `\n## ${p.replace(/^###\s*/, '')}`
      }

      // Handle subsection headers (e.g., "#### I. Technical Trends")
      if (p.startsWith('####')) {
        return `\n### ${p.replace(/^####\s*/, '')}`
      }

      // Handle numbered points with bold text
      if (p.match(/^\d+\.\s+\*\*/)) {
        return `- ${p.replace(/^\d+\.\s+/, '')}`
      }

      // Handle bullet points
      if (p.startsWith('•') || p.startsWith('-')) {
        return `- ${p.replace(/^[•-]\s*/, '')}`
      }

      // Handle bold sections
      if (p.startsWith('**') && p.endsWith('**')) {
        return `### ${p.replace(/^\*\*|\*\*$/g, '')}`
      }

      // Regular paragraphs
      return p
    })

    return formattedParagraphs
      .join('\n')
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim()
  }

  const parseContent = React.useCallback((content: string) => {
    console.log('Raw content received:', content);
    
    // Initialize with empty strings
    const parsedSections: Record<string, string> = {
      manager: '',
      market: '',
      consumer: '',
      industry: ''
    }
    
    if (!content) {
      console.log('No content to parse');
      return parsedSections;
    }

    try {
      // Split content into sections using markdown h2 headers
      const sections = content.split(/(?=## (?:Research Manager|Market Analyst|Consumer Expert|Industry Specialist))/g)
        .filter(Boolean)
        .map(section => section.trim());
      
      sections.forEach(section => {
        const titleMatch = section.match(/^## ([^\n]+)/);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          const content = section.replace(/^## [^\n]+\n/, '').trim();
          
          if (title.includes('Research Manager')) {
            parsedSections.manager = formatContent(content);
          } else if (title.includes('Market Analyst')) {
            parsedSections.market = formatContent(content);
          } else if (title.includes('Consumer Expert')) {
            parsedSections.consumer = formatContent(content);
          } else if (title.includes('Industry Specialist')) {
            parsedSections.industry = formatContent(content);
          }
        }
      });

      // Log parsed sections
      Object.entries(parsedSections).forEach(([key, value]) => {
        console.log(`${key} section length:`, value?.length || 0);
      });
    } catch (error) {
      console.error('Error parsing content:', error);
    }
    
    return parsedSections;
  }, []);

  const sections = React.useMemo(() => parseContent(content), [content, parseContent])

  return (
    <div className="w-full">
      <Tabs defaultValue="manager" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-transparent p-0 rounded-lg mb-4">
          {agents.map(agent => {
            const Icon = agent.icon
            const hasContent = Boolean(sections[agent.id]?.trim())
            const isActive = selectedTab === agent.id
            return (
              <TabsTrigger 
                key={agent.id} 
                value={agent.id}
                className={`
                  flex items-center gap-2 p-2 sm:p-3
                  data-[state=active]:bg-white data-[state=active]:shadow-md
                  rounded-lg border border-gray-100
                  transition-all duration-200 
                  ${!hasContent ? 'opacity-50' : ''}
                  ${isActive ? 'scale-[1.01]' : 'hover:scale-[1.005]'}
                `}
                disabled={!hasContent}
              >
                <div className={`p-1.5 sm:p-2 rounded-md ${agent.color} transition-colors duration-200`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${agent.iconColor}`} />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-medium text-sm truncate">{agent.title}</div>
                  <div className="text-xs text-gray-500 truncate">{agent.description}</div>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {agents.map(agent => {
          const Icon = agent.icon
          const sectionContent = sections[agent.id]?.trim()
          
          return (
            <TabsContent 
              key={agent.id} 
              value={agent.id}
              className="transition-all duration-500 animate-fadeIn mt-0"
            >
              <div className={`rounded-lg ${agent.color} p-4 sm:p-6 border border-gray-100`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-white/90 shadow-sm ${agent.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{agent.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{agent.description}</p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none 
                  prose-headings:font-semibold prose-headings:text-gray-900 
                  prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-6
                  prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                  prose-h4:text-base prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-3
                  prose-ul:my-4 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-3
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-4 prose-ol:space-y-3
                  prose-li:my-0 prose-li:text-gray-600
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                  [&_ul>li]:pl-0 [&_ul>li]:relative [&_ul>li]:leading-relaxed
                  [&_ol>li]:pl-0 [&_ol>li]:relative [&_ol>li]:leading-relaxed
                  [&_ul>li:before]:hidden
                  divide-y divide-gray-100"
                >
                  {sectionContent ? (
                    <div className="relative space-y-6">
                      <ReactMarkdown>
                        {sectionContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      No analysis available yet. Please click "Generate Market Analysis" to analyze your input.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
} 