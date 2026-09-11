'use client'

import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Cpu,
  Gauge,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionMetrics } from '@/components/chat-dashboard'

function fmt(n: number | undefined) {
  if (n == null) return '—'
  return n.toLocaleString('en-US')
}

function fmtMs(ms: number | undefined) {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

function MetricTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={cn(
          'mt-2 font-mono text-lg font-semibold tabular-nums',
          accent ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function MetricsPanel({ metrics }: { metrics: SessionMetrics }) {
  const { last, totalTokens, promptTokens, completionTokens, responses } =
    metrics
  const promptPct =
    totalTokens > 0 ? Math.round((promptTokens / totalTokens) * 100) : 0

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      {/* Session totals hero */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Session Totals
        </h2>
        <div className="rounded-2xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Layers className="size-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Accumulated tokens
            </span>
          </div>
          <p className="mt-2 font-mono text-4xl font-bold tabular-nums text-foreground">
            {fmt(totalTokens)}
          </p>

          <div className="mt-4 space-y-2">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
              {totalTokens > 0 && (
                <>
                  <div
                    className="bg-primary transition-all duration-500"
                    style={{ width: `${promptPct}%` }}
                  />
                  <div
                    className="bg-success transition-all duration-500"
                    style={{ width: `${100 - promptPct}%` }}
                  />
                </>
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full bg-primary" />
                Prompt {fmt(promptTokens)}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full bg-success" />
                Completion {fmt(completionTokens)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Last response */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Last Response
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <MetricTile
            icon={<ArrowUpRight className="size-3.5" />}
            label="Prompt"
            value={fmt(last?.promptTokens)}
          />
          <MetricTile
            icon={<ArrowDownLeft className="size-3.5" />}
            label="Completion"
            value={fmt(last?.completionTokens)}
          />
          <MetricTile
            icon={<Gauge className="size-3.5" />}
            label="Total"
            value={fmt(last?.totalTokens)}
            accent
          />
          <MetricTile
            icon={<Clock className="size-3.5" />}
            label="Latency"
            value={fmtMs(last?.responseTimeMs)}
          />
        </div>

        <div className="mt-2.5 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Cpu className="size-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Model
            </span>
          </div>
          <p className="mt-2 truncate font-mono text-sm font-semibold text-foreground">
            {last?.model ?? '—'}
          </p>
        </div>
      </section>

      {/* Footer stat */}
      <section className="mt-auto flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <span className="text-xs text-muted-foreground">Responses</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {fmt(responses)}
        </span>
      </section>
    </div>
  )
}
