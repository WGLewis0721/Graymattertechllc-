export interface StarterItem {
  id: string
  title: string
  completed: boolean
}
export const STORAGE_KEY = 'gm.starter.items.v1'

export function normalizeTitle(input: string): string {
  const title = input.trim().replace(/\s+/g, ' ')
  if (!title) throw new Error('Enter a task first.')
  if (title.length > 80) throw new Error('Keep task titles under 81 characters.')
  return title
}
export function addItem(items: StarterItem[], title: string, id: string): StarterItem[] {
  return [{ id, title: normalizeTitle(title), completed: false }, ...items]
}
export function renameItem(items: StarterItem[], id: string, title: string): StarterItem[] {
  const normalized = normalizeTitle(title)
  return items.map(x => x.id === id ? { ...x, title: normalized } : x)
}
export function toggleItem(items: StarterItem[], id: string): StarterItem[] {
  return items.map(x => x.id === id ? { ...x, completed: !x.completed } : x)
}
export function deleteItem(items: StarterItem[], id: string): StarterItem[] {
  return items.filter(x => x.id !== id)
}
export function parseItems(raw: string | null): StarterItem[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return value.filter((x): x is StarterItem =>
      x !== null && typeof x === 'object' &&
      typeof x.id === 'string' && typeof x.title === 'string' &&
      x.title.length <= 80 && typeof x.completed === 'boolean'
    )
  } catch { return [] }
}
