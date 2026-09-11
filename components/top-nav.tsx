'use client'

import { PanelRight, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ModelSelect } from '@/components/model-select'
import { ThemeToggle } from '@/components/theme-toggle'
import type { ChatModelId } from '@/lib/chat-types'
import type { SessionStatus } from '@/components/chat-dashboard'

const STATUS_META: Record<
  SessionStatus,
  { label: string; dot: string; pulse: boolean }
> = {
  ready: { label: 'Ready', dot: 'bg-success', pulse: false },
  thinking: { label: 'Thinking', dot: 'bg-primary', pulse: true },
  streaming: { label: 'Streaming', dot: 'bg-primary', pulse: true },
  error: { label: 'Error', dot: 'bg-destructive', pulse: false },
}

export function TopNav({
  status,
  model,
  onModelChange,
  onNewChat,
  onToggleStats,
  busy,
}: {
  status: SessionStatus
  model: ChatModelId
  onModelChange: (id: ChatModelId) => void
  onNewChat: () => void
  onToggleStats: () => void
  busy: boolean
}) {
  const meta = STATUS_META[status]

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight tracking-tight">
            Nexus Console
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              {meta.pulse && (
                <span
                  className={cn(
                    'absolute inline-flex size-full animate-ping rounded-full opacity-75',
                    meta.dot,
                  )}
                />
              )}
              <span
                className={cn(
                  'relative inline-flex size-2 rounded-full',
                  meta.dot,
                )}
              />
            </span>
            <span className="text-xs text-muted-foreground">{meta.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModelSelect value={model} onChange={onModelChange} disabled={busy} />
        <Button
          onClick={onNewChat}
          size="sm"
          className="gap-1.5 rounded-lg"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleStats}
          aria-label="Toggle metrics panel"
          className="size-9 text-muted-foreground hover:text-foreground xl:hidden"
        >
          <PanelRight className="size-4" />
        </Button>
      </div>
    </header>
  )
}
