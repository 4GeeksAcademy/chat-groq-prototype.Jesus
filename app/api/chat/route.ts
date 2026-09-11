import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from 'ai'
import { createGroq } from '@ai-sdk/groq'
import {
  DEFAULT_MODEL,
  isChatModelId,
  type ChatUIMessage,
} from '@/lib/chat-types'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: 'GROQ_API_KEY is not configured on the server.' },
      { status: 500 },
    )
  }

  const { messages, model }: { messages: ChatUIMessage[]; model?: string } =
    await req.json()

  const selectedModel = isChatModelId(model) ? model : DEFAULT_MODEL
  const startedAt = Date.now()

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

  const result = streamText({
    model: groq(selectedModel),
    system:
      'You are Nexus, a precise and professional AI assistant. Answer clearly and concisely using Markdown where it helps readability.',
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      messageMetadata: ({ part }) => {
        if (part.type === 'start') {
          return {
            model: selectedModel,
            createdAt: Date.now(),
          }
        }

        if (part.type === 'finish') {
          return {
            model: selectedModel,
            promptTokens: part.totalUsage.inputTokens,
            completionTokens: part.totalUsage.outputTokens,
            totalTokens: part.totalUsage.totalTokens,
            responseTimeMs: Date.now() - startedAt,
          }
        }
      },
    }),
  })
}
