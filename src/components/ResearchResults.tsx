import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart2, Search, Users, Lightbulb, Loader2, Download, Copy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'

interface AgentResult {
  result?: string;
  error?: string;
  status: 'success' | 'error';
  timestamp: string;
}

interface ResearchResultsProps {
  content: {
    metadata: {
      timestamp: string;
      version: string;
      status: 'success' | 'partial_success' | 'error';
    };
    results: {
      manager: string;
      market: string;
      consumer: string;
      industry: string;
    };
    errors: Record<string, string>;
  };
  isLoading?: boolean;
  onRetry?: (agentId: string) => void;
}

type AgentId = 'manager' | 'market' | 'consumer' | 'industry';

const agents = [
  {
    id: 'manager' as AgentId,
    title: 'Research Manager',
    description: 'Strategy & Overview',
    icon: BarChart2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'market' as AgentId,
    title: 'Market Analyst',
    description: 'Market Trends & Competition',
    icon: Search,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  {
    id: 'consumer' as AgentId,
    title: 'Consumer Expert',
    description: 'Consumer Behavior & Segments',
    icon: Users,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200'
  },
  {
    id: 'industry' as AgentId,
    title: 'Industry Specialist',
    description: 'Technical & Industry Analysis',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  }
]

export function ResearchResults({ content, isLoading, onRetry }: ResearchResultsProps) {
  const [activeTab, setActiveTab] = React.useState('manager')
  const [error, setError] = React.useState<string | null>(null)
  
  // Debug log for incoming props
  console.log('ResearchResults Props:', { content, isLoading })
  
  // Validate content structure and check for errors
  React.useEffect(() => {
    console.log('Content in useEffect:', content)
    try {
      if (!content) {
        console.log('No content provided')
        setError('No content provided')
        return
      }
      
      if (!content.metadata || !content.results) {
        console.log('Invalid content structure:', content)
        setError('Invalid content structure')
        return
      }

      // Check for backend errors
      if (content.metadata.status === 'error') {
        const errorMessages = Object.entries(content.errors || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
        console.log('Backend errors:', errorMessages)
        setError(errorMessages || 'An error occurred during analysis')
        return
      }
      
      // Log the actual results
      console.log('Valid content structure:', {
        metadata: content.metadata,
        results: content.results,
        errors: content.errors
      })
      
      setError(null)
    } catch (e) {
      console.error('Error validating content:', e)
      setError('Error validating content structure')
    }
  }, [content])

  const processContent = (content: string | undefined): string => {
    if (!content) return ''
    
    try {
      return content
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\/g, '')
        .trim()
    } catch (err) {
      console.error('Error processing content:', err)
      return content || ''
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Content copied to clipboard')
    } catch (err) {
      console.error('Error copying to clipboard:', err)
      toast.error('Failed to copy: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const exportToPDF = async () => {
    try {
      const markdown = Object.entries(content.results).map(([key, value]) => {
        try {
          const agent = agents.find(a => a.id === key)
          return `# ${agent?.title || key}\n${processContent(value)}\n\n`
        } catch (err) {
          console.error(`Error processing ${key} for export:`, err)
          return `# ${key}\nError processing content\n\n`
        }
      }).join('\n')

      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
      saveAs(blob, 'market_research_report.md')
      toast.success('Report exported successfully')
    } catch (err) {
      console.error('Error exporting report:', err)
      toast.error('Failed to export: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Add a debug component to show raw data
  const DebugInfo = () => (
    <div className="mb-4 p-4 bg-gray-100 rounded-lg text-xs">
      <div className="font-bold mb-2">Raw Content:</div>
      <pre className="overflow-auto max-h-40 bg-white p-2 rounded">
        {JSON.stringify(content, null, 2)}
      </pre>
      <div className="font-bold mt-4 mb-2">Content by Agent:</div>
      {Object.entries(content.results || {}).map(([key, value]) => (
        <div key={key} className="mt-2">
          <div className="font-semibold text-blue-600">{key}:</div>
          <pre className="overflow-auto max-h-20 bg-white p-2 rounded">
            {value}
          </pre>
          <div className="font-semibold mt-1">Processed:</div>
          <pre className="overflow-auto max-h-20 bg-white p-2 rounded">
            {processContent(value)}
          </pre>
          <div className="font-semibold mt-1">Length:</div>
          <pre className="overflow-auto bg-white p-2 rounded">
            Raw: {value?.length || 0}, Processed: {processContent(value)?.length || 0}
          </pre>
        </div>
      ))}
    </div>
  )

  // Add debug logging for content
  React.useEffect(() => {
    console.log('Raw content in ResearchResults:', content)
    if (content?.results) {
      console.log('Processed content:', {
        manager: processContent(content.results.manager)?.length,
        market: processContent(content.results.market)?.length,
        consumer: processContent(content.results.consumer)?.length,
        industry: processContent(content.results.industry)?.length
      })
    }
  }, [content])

  // Validate content structure and check for errors
  React.useEffect(() => {
    try {
      if (!content) {
        setError('No content provided')
        return
      }
      
      if (!content.metadata || !content.results) {
        setError('Invalid content structure')
        return
      }

      const hasResults = Object.values(content.results).some(result => 
        result && typeof result === 'string' && result.trim().length > 0
      )
      
      if (!hasResults && !isLoading) {
        setError('No results available')
        return
      }

      setError(null)
    } catch (e) {
      console.error('Error validating content:', e)
      setError('Error validating content structure')
    }
  }, [content, isLoading])

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-700 font-medium mb-2">Error:</div>
        <pre className="whitespace-pre-wrap text-sm text-red-600">{error}</pre>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetry('all')}
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Analysis
          </Button>
        )}
      </div>
    )
  }

   return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 bg-transparent h-auto p-0">
          {agents.map((agent) => (
            <TabsTrigger
              key={agent.id}
              value={agent.id}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200',
                agent.bgColor,
                agent.borderColor,
                'hover:shadow-md hover:scale-[1.02] data-[state=active]:shadow-lg',
                'data-[state=active]:border-2 data-[state=active]:scale-[1.02]',
                'min-h-[100px]' // Ensure minimum height for consistent tab sizes
              )}
            >
              <agent.icon className={cn('w-6 h-6', agent.color)} />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-sm">{agent.title}</div>
                <div className="text-xs text-gray-600">{agent.description}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {agents.map((agent) => (
          <TabsContent key={agent.id} value={agent.id} className="mt-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={cn('text-xl font-bold flex items-center gap-2', agent.color)}>
                  <agent.icon className="w-5 h-5" />
                  {agent.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(processContent(content.results[agent.id]))}
                    disabled={!content.results[agent.id] || content.results[agent.id] === 'None'}
                    className="hover:bg-gray-50 border-2 text-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  {onRetry && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRetry(agent.id)}
                      disabled={isLoading}
                      className="hover:bg-gray-50 border-2 text-sm"
                    >
                      <RefreshCw className={cn('w-4 h-4 mr-1', isLoading && 'animate-spin')} />
                      Retry
                    </Button>
                  )}
                </div>
              </div>

              <div className="prose prose-base max-w-none">
                {isLoading && !content.results[agent.id] ? (
                  <div className="flex items-center gap-3 text-gray-500 p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-base">Analyzing...</span>
                  </div>
                ) : content.results[agent.id] && content.results[agent.id] !== 'None' ? (
                  <ReactMarkdown
                    className="break-words whitespace-pre-wrap"
                    components={{
                       h1: ({node, ...props}) => (
                        <h1 className="text-2xl font-bold mt-4 mb-3 pb-1 border-b border-gray-200 text-gray-900" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className="text-xl font-bold mt-3 mb-2 text-gray-800" {...props} />
                      ),
                      h3: ({node, ...props}) => (
                         <h3 className="text-lg font-semibold mt-2 mb-1 text-gray-800" {...props} />
                      ),
                       ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 my-1 space-y-1 marker:text-blue-600" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className="list-decimal pl-5 my-1 space-y-1 marker:text-blue-600" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="pl-1 leading-relaxed" {...props} />
                      ),
                      p: ({node, ...props}) => (
                       <p className="my-2 leading-relaxed text-gray-700" {...props} />
                      ),
                      strong: ({node, ...props}) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                      em: ({node, ...props}) => (
                        <em className="italic text-gray-800" {...props} />
                      ),
                       blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-blue-200 pl-3 my-2 italic text-gray-700" {...props} />
                      ),
                       code: ({node, ...props}) => (
                        <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800" {...props} />
                      ),
                      pre: ({node, ...props}) => (
                        <pre className="bg-gray-100 rounded-lg p-3 overflow-x-auto my-2" {...props} />
                      ),
                    }}
                  >
                    {processContent(content.results[agent.id])}
                  </ReactMarkdown>
                ) : (
                  <div className="text-gray-500 p-4 bg-gray-50 rounded-xl border-2 border-gray-100 text-center text-base">
                    No results available
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button
          onClick={exportToPDF}
          disabled={isLoading || !Object.values(content.results).some(r => r && r !== 'None')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md text-sm"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}