import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart2, Users, Lightbulb, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define agents first
const agents = [
  {
    id: 'manager',
    title: 'Research Manager',
    description: 'Strategy & Coordination',
    icon: BarChart2,
    color: 'bg-blue-50/70',
    iconColor: 'text-blue-600',
    selectedColor: 'bg-gradient-to-b from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    shadowColor: 'shadow-blue-100'
  },
  {
    id: 'market',
    title: 'Market Analyst',
    description: 'Trends & Competition',
    icon: Search,
    color: 'bg-emerald-50/70',
    iconColor: 'text-emerald-600',
    selectedColor: 'bg-gradient-to-b from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-200',
    shadowColor: 'shadow-emerald-100'
  },
  {
    id: 'consumer',
    title: 'Consumer Expert',
    description: 'Behavior & Segments',
    icon: Users,
    color: 'bg-violet-50/70',
    iconColor: 'text-violet-600',
    selectedColor: 'bg-gradient-to-b from-violet-50 to-violet-100',
    borderColor: 'border-violet-200',
    shadowColor: 'shadow-violet-100'
  },
  {
    id: 'industry',
    title: 'Industry Specialist',
    description: 'Technical Analysis',
    icon: Lightbulb,
    color: 'bg-amber-50/70',
    iconColor: 'text-amber-600',
    selectedColor: 'bg-gradient-to-b from-amber-50 to-amber-100',
    borderColor: 'border-amber-200',
    shadowColor: 'shadow-amber-100'
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
      // Handle section headers
      if (p.startsWith('###')) {
        return `\n## ${p.replace(/^###\s*/, '')}`
      }

      // Handle subsection headers
      if (p.startsWith('####')) {
        return `\n### ${p.replace(/^####\s*/, '')}`
      }

      // Handle numbered lists
      if (p.match(/^\d+\.\s+/)) {
        return `\n- ${p.replace(/^\d+\.\s+/, '')}`
      }

      // Handle bullet points
      if (p.startsWith('•') || p.startsWith('-')) {
        return `\n- ${p.replace(/^[•-]\s*/, '')}`
      }

      // Handle bold sections
      if (p.startsWith('**') && p.endsWith('**')) {
        return `\n### ${p.replace(/^\*\*|\*\*$/g, '')}`
      }

      // Regular paragraphs
      return `\n${p}`
    })

    return formattedParagraphs
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const parseContent = React.useCallback((content: string) => {
    const parsedSections: Record<string, string> = {
      manager: '',
      market: '',
      consumer: '',
      industry: ''
    }
    
    if (!content) return parsedSections

    try {
      const sections = content.split(/(?=## (?:Research Manager|Market Analyst|Consumer Expert|Industry Specialist))/g)
        .filter(Boolean)
        .map(section => section.trim())
      
      sections.forEach(section => {
        const titleMatch = section.match(/^## ([^\n]+)/)
        if (titleMatch) {
          const title = titleMatch[1].trim()
          const content = section.replace(/^## [^\n]+\n/, '').trim()
          
          if (title.includes('Research Manager')) {
            parsedSections.manager = formatContent(content)
          } else if (title.includes('Market Analyst')) {
            parsedSections.market = formatContent(content)
          } else if (title.includes('Consumer Expert')) {
            parsedSections.consumer = formatContent(content)
          } else if (title.includes('Industry Specialist')) {
            parsedSections.industry = formatContent(content)
          }
        }
      })
    } catch (error) {
      console.error('Error parsing content:', error)
    }
    
    return parsedSections
  }, [])

  const sections = React.useMemo(() => parseContent(content), [content, parseContent])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="manager" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-transparent p-0 mb-6">
          {agents.map(agent => {
            const Icon = agent.icon
            const hasContent = Boolean(sections[agent.id]?.trim())
            const isActive = selectedTab === agent.id
            return (
              <TabsTrigger 
                key={agent.id} 
                value={agent.id}
                className={cn(
                  "relative flex items-center gap-3 p-3 sm:p-4",
                  "rounded-xl border transition-all duration-300 ease-out",
                  "hover:shadow-lg group data-[state=active]:shadow-lg",
                  isActive ? [
                    agent.selectedColor,
                    agent.borderColor,
                    'shadow-md scale-[1.02]',
                    'ring-2',
                    `ring-${agent.iconColor.split('-')[1]}-300`,
                    'ring-opacity-50',
                    'after:absolute after:bottom-[-2px] after:left-[calc(50%-1.5rem)] after:w-12 after:h-1',
                    'after:rounded-full after:transition-all after:duration-300',
                    `after:bg-${agent.iconColor.split('-')[1]}-500`,
                    'after:shadow-sm'
                  ] : [
                    'bg-white/95 hover:bg-white',
                    'border-gray-100 hover:border-gray-200',
                    'hover:scale-[1.01]',
                    'hover:ring-1',
                    `hover:ring-${agent.iconColor.split('-')[1]}-200`,
                    'hover:ring-opacity-50'
                  ],
                  !hasContent && 'opacity-50 cursor-not-allowed hover:scale-100'
                )}
                disabled={!hasContent}
              >
                <div className={cn(
                  "p-2 sm:p-2.5 rounded-lg transition-all duration-300",
                  isActive ? [
                    'bg-white shadow-sm',
                    'scale-110',
                    'ring-1',
                    `ring-${agent.iconColor.split('-')[1]}-200`,
                    'ring-opacity-50'
                  ] : [
                    agent.color,
                    'group-hover:bg-white/80',
                    'group-hover:shadow-sm'
                  ],
                  "group-hover:shadow-sm"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6",
                    agent.iconColor,
                    "transition-all duration-300",
                    "group-hover:scale-110",
                    "group-hover:rotate-3",
                    isActive && "rotate-6 scale-110"
                  )} />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className={cn(
                    "font-semibold text-sm sm:text-base truncate",
                    isActive ? "text-gray-900" : "text-gray-700",
                    "transition-colors duration-300",
                    "group-hover:text-gray-900"
                  )}>
                    {agent.title}
                  </div>
                  <div className={cn(
                    "text-xs sm:text-sm truncate",
                    isActive ? "text-gray-600" : "text-gray-500",
                    "transition-colors duration-300",
                    "group-hover:text-gray-600"
                  )}>
                    {agent.description}
                  </div>
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
              className="mt-0 transition-all duration-500 animate-fadeIn"
            >
              <div className={cn(
                "rounded-xl p-6 sm:p-8 lg:p-10",
                "border shadow-lg backdrop-blur-sm",
                agent.color,
                agent.borderColor
              )}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn(
                    "p-3 sm:p-4 rounded-xl bg-white/90",
                    "shadow-md transition-transform duration-300 hover:scale-105",
                    agent.shadowColor,
                    agent.iconColor
                  )}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                      {agent.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 truncate">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "prose prose-sm sm:prose lg:prose-lg max-w-none",
                  "prose-headings:font-bold prose-headings:text-gray-900",
                  "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6",
                  "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4",
                  "prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4",
                  "prose-ul:my-6 prose-ul:list-none prose-ul:pl-0",
                  "prose-li:my-3 prose-li:text-gray-600",
                  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                  "[&_ul>li]:relative [&_ul>li]:pl-8 [&_ul>li]:leading-relaxed",
                  `[&_ul>li:before]:absolute [&_ul>li:before]:left-0 [&_ul>li:before]:text-${agent.iconColor.split('-')[1]}-400`,
                  "[&_ul>li:before]:content-['•'] [&_ul>li:before]:text-2xl [&_ul>li:before]:leading-tight"
                )}>
                  {sectionContent ? (
                    <div className="relative space-y-6">
                      <ReactMarkdown>
                        {sectionContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-2">
                        <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      </div>
                      <p className="text-lg text-gray-500">
                        No analysis available yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Click "Generate Market Analysis" to analyze your input.
                      </p>
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