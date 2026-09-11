import type { UIMessage } from 'ai'

export type ChatModelId =
  | 'openai/gpt-oss-120b'
  | 'openai/gpt-oss-20b'
  | 'qwen/qwen3.8-27b'
  | 'groq/compound'

export const CHAT_MODELS: { id: ChatModelId; label: string; vendor: string }[] =
  [
    { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', vendor: 'Groq' },
    { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', vendor: 'Groq' },
    { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', vendor: 'Groq' },
    { id: 'groq/compound', label: 'Compound', vendor: 'Groq' },
  ]

export const DEFAULT_MODEL: ChatModelId = 'openai/gpt-oss-120b'

export function isChatModelId(value: unknown): value is ChatModelId {
  return CHAT_MODELS.some((m) => m.id === value)
}

export type ChatMetadata = {
  model?: string
  createdAt?: number
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  responseTimeMs?: number
}

export type ChatUIMessage = UIMessage<ChatMetadata>
