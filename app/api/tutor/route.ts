import { gateway } from '@ai-sdk/gateway'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (typeof message !== 'string' || !message.trim() || !context) {
      return NextResponse.json({ error: 'Falta la pregunta o el contexto.' }, { status: 400 })
    }

    const result = await generateText({
      model: gateway('openai/gpt-5-mini'),
      system: `Eres el Tutor IA de ADVENTURE, una plataforma para aprender inglés. Ayudas a un alumno de grado ${context.grade} con la actividad "${context.title}".

Contexto de la actividad:
- Tema: ${context.description}
- Tipo: ${context.type}
- Consigna actual: ${context.question}
- Opciones: ${context.options?.join(', ') || 'no aplica'}
- Vocabulario o secuencia: ${context.vocabulary || 'no disponible'}
- Explicación disponible: ${context.explanation || 'no disponible'}

Responde en el idioma de la pregunta del alumno. Adapta el lenguaje al grado: frases muy simples y ejemplos concretos para grados bajos; explicaciones algo más completas para grados altos. Enseña, no resuelvas automáticamente: da una pista o explica el concepto antes de revelar la respuesta. Si pregunta directamente por la respuesta, guía con una pista y pide que lo intente. Sé breve, amable y concreto. No inventes información que no está en el contexto.`,
      prompt: message.trim(),
      maxOutputTokens: 220,
      temperature: 0.4,
    })

    return NextResponse.json({ answer: result.text })
  } catch {
    return NextResponse.json(
      { error: 'No pude conectarme con el Tutor IA. Intenta nuevamente.' },
      { status: 500 },
    )
  }
}
