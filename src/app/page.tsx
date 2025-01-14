'use client'

import { useState, useEffect } from 'react'
import { useCompletion } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResearchResults } from '@/components/ResearchResults'
import { Loader2, Search, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function MarketResearchPage() {
  const [productName, setProductName] = useState('')
  const [context, setContext] = useState('')
  const [analysisResults, setAnalysisResults] = useState({
    manager: '',
    market: '',
    consumer: '',
    industry: ''
  })
  
  const { complete, isLoading } = useCompletion({
    api: '/api/chat',
    onResponse: async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.slice(6).trim())
                if (jsonData.text) {
                  const text = jsonData.text
                  if (text.includes('Research Manager Analysis')) {
                    setAnalysisResults(prev => ({ ...prev, manager: text }))
                  } else if (text.includes('Market Analyst Insights')) {
                    setAnalysisResults(prev => ({ ...prev, market: text }))
                  } else if (text.includes('Consumer Expert Review')) {
                    setAnalysisResults(prev => ({ ...prev, consumer: text }))
                  } else if (text.includes('Industry Specialist Assessment')) {
                    setAnalysisResults(prev => ({ ...prev, industry: text }))
                  }
                }
              } catch (err) {
                console.error('Error parsing JSON:', err)
              }
            }
          }
        }
      } catch (err) {
        console.error('Error reading stream:', err)
        throw err
      } finally {
        reader?.releaseLock()
      }
    },
    onFinish: () => {
      toast.success('Analysis completed!')
    },
    onError: (error) => {
      console.error('Analysis error:', error)
      toast.error(error.message || 'Failed to analyze')
    }
  })

  // Add a useEffect to monitor analysisResults changes
  useEffect(() => {
    console.log('Frontend - Analysis results updated:', analysisResults)
  }, [analysisResults])

  const handleSubmit = async () => {
    if (!productName || !context) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      console.log('Frontend - Starting new analysis')
      // Reset results before starting new analysis
      setAnalysisResults({
        manager: '',
        market: '',
        consumer: '',
        industry: ''
      })

      console.log('Frontend - Submitting analysis for:', { productName, context })
      
      // Format the prompt in the expected format
      const prompt = `Product/Service: ${productName}\nContext: ${context}`
      
      await complete(prompt)
    } catch (err: any) {
      console.error('Frontend - Error during analysis:', {
        error: err,
        message: err.message,
        stack: err.stack
      })
      toast.error('Failed to complete analysis. Please try again.')
    }
  }

  // Combine all results for the ResearchResults component
  const combinedResults = Object.entries(analysisResults)
    .filter(([_, content]) => content)
    .map(([type, content]) => {
      const title = type === 'manager' ? 'Research Manager Analysis' :
                   type === 'market' ? 'Market Analyst Insights' :
                   type === 'consumer' ? 'Consumer Expert Review' :
                   'Industry Specialist Assessment'
      return `## ${title}\n${content}`
    })
    .join('\n\n')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Compact Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  AI Market Research System
                </h1>
                <p className="text-xs text-gray-500">
                  Powered by Advanced AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Compact Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Market Research Analysis
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Get comprehensive market insights powered by AI experts
          </p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} 
          className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 transform transition-all duration-200 hover:shadow-lg"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Compact Product Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                Product/Service Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g., Tesla Model 3, Spotify Premium"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="pl-10 transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Compact Analysis Context Field */}
            <div className="space-y-1.5">
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">
                Analysis Context
              </label>
              <Textarea
                id="context"
                name="context"
                placeholder="Describe your product/service and specific areas you'd like to analyze..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[120px] sm:min-h-[140px] resize-none transition-all duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                required
              />
              <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 text-blue-500" />
                <span>Provide relevant details for more accurate analysis</span>
              </p>
            </div>

            {/* Compact Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoading || !productName || !context}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Generate Market Analysis</span>
              )}
            </Button>
          </div>
        </form>

        {/* Compact Results Section */}
        {Object.values(analysisResults).some(content => content) && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 transform transition-all duration-500 animate-fadeIn">
            <ResearchResults content={combinedResults} />
          </div>
        )}
      </main>
    </div>
  )
}
