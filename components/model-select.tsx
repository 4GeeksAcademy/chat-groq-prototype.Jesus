'use client'

import { ChevronDown, Cpu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { CHAT_MODELS, type ChatModelId } from '@/lib/chat-types'

export function ModelSelect({
  value,
  onChange,
  disabled,
}: {
  value: ChatModelId
  onChange: (id: ChatModelId) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = CHAT_MODELS.find((m) => m.id === value) ?? CHAT_MODELS[0]

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <Cpu className="size-4 text-primary" />
        <span className="hidden sm:inline">{active.label}</span>
        <span className="sm:hidden">{active.vendor}</span>
        <ChevronDown
          className={cn(
            'size-3.5 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl shadow-black/20"
        >
          {CHAT_MODELS.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                role="option"
                aria-selected={m.id === value}
                onClick={() => {
                  onChange(m.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                  m.id === value && 'bg-accent',
                )}
              >
                <span className="flex flex-col">
                  <span className="font-medium text-popover-foreground">
                    {m.label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {m.id}
                  </span>
                </span>
                {m.id === value && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
