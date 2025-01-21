'use client'
//filename: page.tsx
import { useState, useEffect } from 'react'
import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResearchResults } from '@/components/ResearchResults'
import { Loader2, Search, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

type AnalysisStatus = 'success' | 'error' | 'partial_success'
type AgentType = 'manager' | 'market' | 'consumer' | 'industry'
interface ChartData {
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
        }[];
    };
}
interface TableData {
    title: string;
    headers: string[];
    rows: Record<string, string>[];
}

interface AgentResult {
    content?: string;
    charts?: ChartData[];
    tables?: TableData[];
    error?: string;
    status: 'success' | 'error';
    timestamp: string;
}

interface AnalysisState {
    metadata: {
        timestamp: string;
        version: string;
        status: AnalysisStatus;
    };
    results: {
        manager: AgentResult;
        market: AgentResult;
        consumer: AgentResult;
        industry: AgentResult;
    };
    errors: Record<string, string>;
}

export default function MarketResearchPage() {
    const [productName, setProductName] = useState('')
    const [context, setContext] = useState('')
      const initialAgentResult: AgentResult = {
          status: 'success',
          timestamp: new Date().toISOString(),
       };
    const [analysisResults, setAnalysisResults] = useState<AnalysisState>({
        metadata: {
            timestamp: new Date().toISOString(),
            version: '2.0',
            status: 'success'
        },
        results: {
            manager: {
                status: 'success',
                timestamp: new Date().toISOString()
            },
            market: {
                status: 'success',
                timestamp: new Date().toISOString()
            },
            consumer: {
                status: 'success',
                timestamp: new Date().toISOString()
            },
            industry: {
                status: 'success',
                timestamp: new Date().toISOString()
            }
        },
        errors: {}
    })

    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);


    // Add debug logging for state changes
    useEffect(() => {
        console.log('Analysis results updated:', analysisResults)
    }, [analysisResults])

      const { complete, isLoading } = useCompletion({
        api: '/api/chat',
        onResponse: async (response) => {
             console.log('Response received:', response.status)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            setIsAnalysisLoading(true);

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            try {
                while (true) {
                    const { done, value } = await reader!.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    buffer += chunk

                    // Process complete messages
                    const lines = buffer.split('\n')
                    buffer = lines.pop() || '' // Keep incomplete line

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonData = JSON.parse(line.slice(6))
                                console.log('Parsed streaming data:', jsonData)

                                // Handle the complete response object with results
                                if (jsonData.metadata && jsonData.results) {
                                    const newResults: Record<string, AgentResult> = {};
                                    Object.entries(jsonData.results).forEach(([key, value]) => {
                                        if (key === 'manager' || key === 'market' || key === 'consumer' || key === 'industry') {
                                            newResults[key] = {
                                                content: typeof value === 'string' ? value : (value as any)?.content,
                                                charts: (value as any)?.charts || [],
                                                tables: (value as any)?.tables || [],
                                                status: 'success',
                                                timestamp: new Date().toISOString()
                                            };
                                        }
                                    });

                                    setAnalysisResults(prev => ({
                                        metadata: {
                                            timestamp: jsonData.metadata.timestamp || new Date().toISOString(),
                                            version: jsonData.metadata.version || '2.0',
                                            status: jsonData.metadata.status || 'error'
                                        },
                                        results: {
                                            ...prev.results,
                                            ...newResults
                                        },
                                        errors: jsonData.errors || {}
                                    }));
                                }

                                // Handle streaming updates
                                if (jsonData.results) {
                                    const newResults: Record<string, AgentResult> = {};
                                    Object.entries(jsonData.results).forEach(([key, value]) => {
                                        if (key === 'manager' || key === 'market' || key === 'consumer' || key === 'industry') {
                                            newResults[key] = {
                                                content: typeof value === 'string' ? value : (value as any)?.content,
                                                charts: (value as any)?.charts || [],
                                                tables: (value as any)?.tables || [],
                                                status: 'success',
                                                timestamp: new Date().toISOString()
                                            };
                                        }
                                    });

                                    setAnalysisResults(prev => ({
                                        ...prev,
                                        results: {
                                            ...prev.results,
                                            ...newResults
                                        }
                                    }));
                                }
                            } catch (err) {
                                console.error('Error parsing JSON:', err)
                                setAnalysisResults(prev => ({
                                    ...prev,
                                    metadata: { ...prev.metadata, status: 'error' },
                                    errors: {
                                        ...prev.errors,
                                        parsing: `Error parsing response: ${err instanceof Error ? err.message : 'Unknown error'}`
                                    }
                                }))
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error reading stream:', err)
                setAnalysisResults(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, status: 'error' },
                    errors: {
                        ...prev.errors,
                        stream: `Error reading stream: ${err instanceof Error ? err.message : 'Unknown error'}`
                    }
                }))
            } finally {
                reader?.releaseLock()
                 setIsAnalysisLoading(false);
            }
        },
        onFinish: () => {
            console.log('Analysis completed, final results:', analysisResults)
            if (Object.keys(analysisResults.errors).length === 0) {
                setAnalysisResults(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, status: 'success' }
                }))
                toast.success('Analysis completed successfully!')
            }
            setIsAnalysisLoading(false);
        },
        onError: (error) => {
            console.error('Analysis error:', error)
            setAnalysisResults(prev => ({
                ...prev,
                metadata: { ...prev.metadata, status: 'error' },
                errors: {
                    ...prev.errors,
                    system: error.message || 'Failed to analyze'
                }
            }))
            toast.error(error.message || 'Analysis failed')
            setIsAnalysisLoading(false);
        }
    })


    const handleSubmit = async () => {
        if (!productName) {
            toast.error('Please enter a product or service name')
            return
        }

         try {
            console.log('Starting new analysis')
            // Reset results before starting new analysis
              setAnalysisResults({
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '2.0',
                    status: 'success'
                },
                results: {
                    manager: initialAgentResult,
                    market: initialAgentResult,
                    consumer: initialAgentResult,
                    industry: initialAgentResult
                },
                errors: {}
            })
            setIsAnalysisLoading(true)

           const payload = JSON.stringify({
                product_name: productName,
                context: context || ''
           });

           console.log('Submitting analysis with payload:', payload)
            await complete(payload)


        } catch (err: any) {
            console.error('Error during analysis:', {
                error: err,
                message: err.message,
                stack: err.stack
            })
            setAnalysisResults(prev => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    status: 'error'
                },
                errors: {
                    ...prev.errors,
                    system: err.message || 'Failed to complete analysis'
                }
            }))
            toast.error('Failed to complete analysis. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
            {/* Enhanced Header Section */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-sm">
                                <Search className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                                    AI Market Research System
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Powered by Advanced AI
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="space-y-8">
                    {/* Enhanced Input Section */}
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <Input
                                placeholder="Enter Product or Service Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="text-lg"
                            />
                            <Textarea
                                placeholder="Additional Context (optional) - Add any specific aspects you'd like to analyze"
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="h-32 text-base"
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !productName}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing Market...
                                    </>
                                ) : (
                                    <>
                                        Analyze Market
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {(isAnalysisLoading || Object.values(analysisResults.results).some((r: AgentResult) => 
                        Boolean(r?.content) || (r?.charts && r.charts.length > 0) || (r?.tables && r.tables.length > 0)
                    )) && (
                        <div className="mt-8">
                            <ResearchResults
                                content={analysisResults}
                                isLoading={isAnalysisLoading}
                                onRetry={(agentId) => {
                                    console.log('Retry requested for:', agentId)
                                    // Implement retry logic here
                                }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}