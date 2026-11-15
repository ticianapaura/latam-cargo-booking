/* Session storage, guarded.
   Limits (also in the README): one tab only, gone when the tab closes, editable in dev tools,
   can be unavailable (private windows, blocked site data, full quota). Every call is wrapped,
   and what is loaded is validated before use; on any failure the agent keeps working in memory. */

export type KV = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

export class GuardedStore {
  private mem = new Map<string, string>();
  /** False once a write failed: the UI then says "Can't resume after a reload" */
  persistent: boolean;
  private backing: KV | null;

  constructor(backing?: KV | null) {
    this.backing = backing === undefined ? defaultBacking() : backing;
    this.persistent = !!this.backing;
  }

  get<T>(key: string, validate: (v: unknown) => v is T): T | null {
    let raw: string | null = this.mem.get(key) ?? null;
    if (this.backing) {
      try {
        raw = this.backing.getItem(key) ?? raw;
      } catch {
        this.persistent = false;
      }
    }
    if (raw == null) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return validate(parsed) ? parsed : null; // edited or malformed data is dropped, never trusted
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown) {
    const raw = JSON.stringify(value);
    this.mem.set(key, raw);
    if (!this.backing) return;
    try {
      this.backing.setItem(key, raw);
    } catch {
      this.persistent = false; // quota or blocked storage: keep going in memory
    }
  }

  remove(key: string) {
    this.mem.delete(key);
    try {
      this.backing?.removeItem(key);
    } catch {
      /* nothing to do */
    }
  }
}

function defaultBacking(): KV | null {
  try {
    const s = (globalThis as { sessionStorage?: KV }).sessionStorage;
    if (!s) return null;
    s.setItem("cargopilot.probe", "1");
    s.removeItem("cargopilot.probe");
    return s;
  } catch {
    return null;
  }
}
