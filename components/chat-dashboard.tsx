'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  DEFAULT_MODEL,
  type ChatMetadata,
  type ChatModelId,
  type ChatUIMessage,
} from '@/lib/chat-types'
import { ChatInput } from '@/components/chat-input'
import { ChatMessages } from '@/components/chat-messages'
import { MetricsPanel } from '@/components/metrics-sidebar'
import { TopNav } from '@/components/top-nav'

export type SessionStatus = 'ready' | 'thinking' | 'streaming' | 'error'

export type SessionMetrics = {
  last: ChatMetadata | null
  totalTokens: number
  promptTokens: number
  completionTokens: number
  responses: number
  avgResponseMs: number
}

export function ChatDashboard() {
  const [model, setModel] = useState<ChatModelId>(DEFAULT_MODEL)
  const [statsOpen, setStatsOpen] = useState(false)

  const { messages, sendMessage, status, stop, setMessages, error } =
    useChat<ChatUIMessage>({
      transport: new DefaultChatTransport({ api: '/api/chat' }),
    })

  const busy = status === 'submitted' || status === 'streaming'

  const sessionStatus: SessionStatus = error
    ? 'error'
    : status === 'submitted'
      ? 'thinking'
      : status === 'streaming'
        ? 'streaming'
        : 'ready'

  const metrics = useMemo<SessionMetrics>(() => {
    const done = messages.filter(
      (m) => m.role === 'assistant' && m.metadata?.totalTokens != null,
    )
    let totalTokens = 0
    let promptTokens = 0
    let completionTokens = 0
    let responseMsSum = 0
    for (const m of done) {
      const meta = m.metadata
      if (!meta) continue
      totalTokens += meta.totalTokens ?? 0
      promptTokens += meta.promptTokens ?? 0
      completionTokens += meta.completionTokens ?? 0
      responseMsSum += meta.responseTimeMs ?? 0
    }
    const last = done.length ? (done[done.length - 1].metadata ?? null) : null
    return {
      last,
      totalTokens,
      promptTokens,
      completionTokens,
      responses: done.length,
      avgResponseMs: done.length ? responseMsSum / done.length : 0,
    }
  }, [messages])

  function send(text: string) {
    sendMessage({ text }, { body: { model } })
  }

  function newChat() {
    stop()
    setMessages([])
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <TopNav
        status={sessionStatus}
        model={model}
        onModelChange={setModel}
        onNewChat={newChat}
        onToggleStats={() => setStatsOpen((v) => !v)}
        busy={busy}
      />

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex min-h-full flex-col">
              <ChatMessages messages={messages} onPickPrompt={send} />
            </div>
          </div>

          {error && (
            <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Something went wrong generating a response. Please try again.
              </p>
            </div>
          )}

          <ChatInput onSend={send} onStop={stop} busy={busy} />
        </main>

        {/* Desktop sidebar */}
        <aside className="hidden w-80 shrink-0 border-l border-border bg-sidebar xl:block">
          <MetricsPanel metrics={metrics} />
        </aside>

        {/* Mobile / tablet slide-over */}
        {statsOpen && (
          <div className="fixed inset-0 z-40 xl:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setStatsOpen(false)}
              aria-hidden
            />
            <div
              className={cn(
                'absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l border-border bg-sidebar shadow-2xl',
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="text-sm font-semibold">Telemetry</span>
                <button
                  type="button"
                  onClick={() => setStatsOpen(false)}
                  aria-label="Close metrics panel"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <MetricsPanel metrics={metrics} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
