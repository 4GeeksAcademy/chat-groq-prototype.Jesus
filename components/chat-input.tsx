'use client'

import { ArrowUp, Square } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function ChatInput({
  onSend,
  onStop,
  busy,
}: {
  onSend: (text: string) => void
  onStop: () => void
  busy: boolean
}) {
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  function resize() {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  function submit() {
    const text = value.trim()
    if (!text || busy) return
    onSend(text)
    setValue('')
    requestAnimationFrame(() => {
      if (taRef.current) taRef.current.style.height = 'auto'
    })
  }

  return (
    <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur-md md:px-6">
      <div
        className={cn(
          'mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/30',
        )}
      >
        <textarea
          ref={taRef}
          value={value}
          rows={1}
          onChange={(e) => {
            setValue(e.target.value)
            resize()
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="Send a message..."
          className="max-h-[200px] flex-1 resize-none bg-transparent px-2.5 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />
        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-accent"
          >
            <Square className="size-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-3xl px-1 text-center text-[11px] text-muted-foreground">
        Nexus can make mistakes. Token metrics update after each response.
      </p>
    </div>
  )
}
