// @vitest-environment jsdom

/** Client lifecycle coverage for the optional Web UI settings bridge. */

import { describe, expect, it, vi } from 'vitest'

vi.mock('@deepseek-ai/dsh-client-runtime/client', () => ({
  createSnapshotStore: <T>(initial: T) => {
    let snapshot = initial
    const listeners = new Set<() => void>()
    return {
      getSnapshot: (): T => snapshot,
      subscribe: (listener: () => void): (() => void) => {
        listeners.add(listener)
        return () => { listeners.delete(listener) }
      },
      set: (next: T): void => {
        snapshot = next
        for (const listener of listeners) listener()
      },
      update: (mutator: (draft: T) => void): void => {
        const draft = { ...snapshot }
        mutator(draft)
        snapshot = draft
        for (const listener of listeners) listener()
      },
    }
  },
}))

import { apply } from '../src/client/index.ts'

describe('cc-loop client settings bridge', () => {
  it('binds the card only after webUiSettings becomes available', () => {
    let mountBridge: ((ctx: unknown) => void) | undefined
    const scope = {
      getSnapshot: () => ({
        status: 'ready' as const,
        value: {},
        base: {},
        user: undefined,
        revision: 0,
        writable: true,
        mode: 'host' as const,
      }),
      subscribe: vi.fn(() => vi.fn()),
      load: vi.fn(() => Promise.resolve()),
      set: vi.fn(() => Promise.resolve()),
      unset: vi.fn(() => Promise.resolve()),
    }
    const binder = { bind: vi.fn(() => scope) }
    const register = vi.fn(() => vi.fn())
    const ctx = {
      locale: { register: vi.fn(() => vi.fn()) },
      effect: vi.fn((factory: () => unknown) => factory()),
      get: vi.fn((name: string) => name === 'webUiSettings' ? binder : undefined),
      inject: vi.fn((_services: string[], callback: (injected: unknown) => void) => {
        mountBridge = callback
      }),
      slots: {
        inject: vi.fn((_name: string, mount: () => unknown) => mount()),
        register,
      },
    }

    apply(ctx as never)
    expect(binder.bind).not.toHaveBeenCalled()

    expect(mountBridge).toBeDefined()
    mountBridge?.(ctx)

    expect(binder.bind).toHaveBeenCalledWith({ namespace: 'dsh-cc-loop' })
    expect(register).toHaveBeenCalledWith(expect.objectContaining({ id: 'cc-loop' }), expect.any(Function))
  })
})
