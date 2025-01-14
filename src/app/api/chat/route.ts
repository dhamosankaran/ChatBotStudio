import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = typeof body === 'string' ? body : body.prompt

    if (!prompt) {
      return new NextResponse('Missing prompt', { status: 400 })
    }

    // Extract product name and context from the prompt
    const productMatch = prompt.match(/Product\/Service:\s*([^\n]+)/)
    const contextMatch = prompt.match(/Context:\s*([^\n]+)/)

    if (!productMatch || !contextMatch) {
      throw new Error('Invalid prompt format. Expected format: "Product/Service: <name>\nContext: <context>"')
    }

    const productName = productMatch[1].trim()
    const context = contextMatch[1].trim()

    // Make the request to the backend
    const backendResponse = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_name: productName,
        context: context,
        temperature: 0.7
      })
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${await backendResponse.text()}`)
    }

    // Create a new stream for the frontend
    return new NextResponse(backendResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return new NextResponse(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    )
  }
} 