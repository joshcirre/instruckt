import type { Annotation } from './types'

/** Read Laravel's XSRF-TOKEN cookie for CSRF protection */
function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
  const csrf = getCsrfToken()
  if (csrf) h['X-XSRF-TOKEN'] = csrf
  return h
}

/** Convert snake_case API response to camelCase for JS types */
export function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    out[camel] = Array.isArray(v)
      ? v.map(item => (item && typeof item === 'object' && !Array.isArray(item)) ? toCamelCase(item as Record<string, unknown>) : item)
      : (v && typeof v === 'object' && !Array.isArray(v)) ? toCamelCase(v as Record<string, unknown>) : v
  }
  return out
}

/** Convert camelCase JS payload to snake_case for Laravel API */
function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
    out[snake] = (v && typeof v === 'object' && !Array.isArray(v)) ? toSnake(v as Record<string, unknown>) : v
  }
  return out
}

export type AnnotationPayload = Omit<
  Annotation,
  'id' | 'status' | 'thread' | 'createdAt'
>

export class InstrucktApi {
  constructor(private readonly endpoint: string) {}

  async getAnnotations(): Promise<Annotation[]> {
    const res = await fetch(`${this.endpoint}/annotations`, {
      headers: headers(),
    })
    if (!res.ok) throw new Error(`instruckt: failed to load annotations (${res.status})`)
    const raw: Record<string, unknown>[] = await res.json()
    return raw.map(r => toCamelCase(r) as unknown as Annotation)
  }

  async addAnnotation(data: AnnotationPayload): Promise<Annotation> {
    const res = await fetch(`${this.endpoint}/annotations`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(toSnake(data as unknown as Record<string, unknown>)),
    })
    if (!res.ok) throw new Error(`instruckt: failed to add annotation (${res.status})`)
    return toCamelCase(await res.json()) as unknown as Annotation
  }

  async updateAnnotation(
    annotationId: string,
    data: Partial<Pick<Annotation, 'status' | 'comment'>>,
  ): Promise<Annotation> {
    const res = await fetch(`${this.endpoint}/annotations/${annotationId}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(toSnake(data as unknown as Record<string, unknown>)),
    })
    if (!res.ok) throw new Error(`instruckt: failed to update annotation (${res.status})`)
    return toCamelCase(await res.json()) as unknown as Annotation
  }

  async runAgent(markdown: string, annotationIds?: string[]): Promise<{ resolved_ids: string[] }> {
    const res = await fetch(`${this.endpoint}/run`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        markdown,
        ...(annotationIds?.length ? { annotation_ids: annotationIds } : {}),
      }),
    })

    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`instruckt: failed to run agent (${res.status})`)
    }
    const data = await res.json()
    return { resolved_ids: data.resolved_ids ?? [] }
  }
}
