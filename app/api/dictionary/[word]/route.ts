import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  const word = params.word

  if (!word) {
    return NextResponse.json({ error: 'Word is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}