'use client'

import { Bot, Clock, Gauge, Sparkles, User } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ChatUIMessage } from '@/lib/chat-types'

const SUGGESTIONS = [
  'Explain the difference between REST and GraphQL.',
  'Write a haiku about distributed systems.',
  'Summarize the benefits of edge computing.',
  'Give me 3 tips for reducing token usage.',
]

function messageText(message: ChatUIMessage) {
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join('')
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="size-7" />
      </div>
      <h2 className="mt-5 text-balance text-xl font-semibold tracking-tight">
        How can I help you today?
      </h2>
      <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
        Start a conversation and watch token usage, latency, and model
        telemetry update live in the panel.
      </p>
      <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card p-3.5 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function fmtMs(ms: number | undefined) {
  if (ms == null) return null
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`
}

function MessageRow({ message }: { message: ChatUIMessage }) {
  const isUser = message.role === 'user'
  const text = messageText(message)
  const meta = message.metadata

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          isUser
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-primary-foreground',
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1.5 sm:max-w-[75%]',
          isUser && 'items-end',
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'rounded-tr-sm bg-primary text-primary-foreground'
              : 'rounded-tl-sm border border-border bg-card text-card-foreground',
          )}
        >
          {text ? (
            <p className="whitespace-pre-wrap">{text}</p>
          ) : (
            <span className="inline-flex gap-1 py-1">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </span>
          )}
        </div>

        {!isUser && meta?.totalTokens != null && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Gauge className="size-3" />
              {meta.totalTokens.toLocaleString('en-US')} tok
            </span>
            {fmtMs(meta.responseTimeMs) && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {fmtMs(meta.responseTimeMs)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function ChatMessages({
  messages,
  onPickPrompt,
}: {
  messages: ChatUIMessage[]
  onPickPrompt: (text: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return <EmptyState onPick={onPickPrompt} />
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:px-6">
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
