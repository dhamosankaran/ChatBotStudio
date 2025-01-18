'use client'

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

interface AnalysisState {
    metadata: {
        timestamp: string;
        version: string;
        status: AnalysisStatus;
    };
    results: {
        manager: string;
        market: string;
        consumer: string;
        industry: string;
    };
    errors: Record<string, string>;
}

export default function MarketResearchPage() {
    const [productName, setProductName] = useState('')
    const [context, setContext] = useState('')
    const [analysisResults, setAnalysisResults] = useState<AnalysisState>({
        metadata: {
            timestamp: new Date().toISOString(),
            version: '2.0',
            status: 'success'
        },
        results: {
            manager: '',
            market: '',
            consumer: '',
            industry: ''
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
                                    console.log('Received complete results:', {
                                        metadata: jsonData.metadata,
                                        resultLengths: {
                                            manager: jsonData.results.manager?.length || 0,
                                            market: jsonData.results.market?.length || 0,
                                            consumer: jsonData.results.consumer?.length || 0,
                                            industry: jsonData.results.industry?.length || 0
                                        }
                                    })
                                    
                                    setAnalysisResults(prev => {
                                        const newResults = {
                                            metadata: {
                                                timestamp: jsonData.metadata.timestamp || new Date().toISOString(),
                                                version: jsonData.metadata.version || '2.0',
                                                status: jsonData.metadata.status || 'error'
                                            },
                                            results: {
                                                ...prev.results,
                                                ...Object.fromEntries(
                                                    Object.entries(jsonData.results)
                                                        .filter(([_, value]) => value && typeof value === 'string' && value.trim().length > 0)
                                                )
                                            },
                                            errors: jsonData.errors || {}
                                        }
                                        console.log('Updated analysis results:', newResults)
                                        return newResults
                                    })
                                    continue
                                }
                                
                                // Handle streaming updates
                                if (jsonData && jsonData.results) {
                                   
                                    console.log('Processing streaming results:', {
                                        resultLengths: Object.fromEntries(
                                            Object.entries(jsonData.results)
                                                .map(([key, value]) => [key, typeof value === 'string' ? value.length : 0])
                                        )
                                    })
                                     if(Object.keys(analysisResults.results).length === 0) {
                                         setIsAnalysisLoading(true);
                                     }
                                    setAnalysisResults(prev => {
                                        const newResults = {
                                            ...prev,
                                            results: {
                                                ...prev.results,
                                                ...Object.fromEntries(
                                                    Object.entries(jsonData.results)
                                                        .filter(([_, value]) => value && typeof value === 'string' && value.trim().length > 0)
                                                )
                                            }
                                        }
                                        
                                        console.log('Updated streaming results:', newResults)
                                        return newResults
                                    })
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
                    manager: '',
                    market: '',
                    consumer: '',
                    industry: ''
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
                    {(isAnalysisLoading || Object.values(analysisResults.results).some(r => r.trim().length > 0)) && (
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