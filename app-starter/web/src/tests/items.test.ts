import { describe, it, expect } from 'vitest'
import { addItem, deleteItem, normalizeTitle, renameItem, toggleItem, parseItems } from '../domain/items'

const original = [{ id: '1', title: 'Task', completed: false }]

describe('task model', () => {
  it('validates titles', () => {
    expect(normalizeTitle('  One   task  ')).toBe('One task')
    expect(() => normalizeTitle(' ')).toThrow()
    expect(() => normalizeTitle('X'.repeat(81))).toThrow()
  })
  it('creates, edits and completes without mutating input', () => {
    const a = addItem(original, 'Second', '2')
    expect(a).toHaveLength(2)
    expect(renameItem(a, '2', 'Renamed')[0].title).toBe('Renamed')
    expect(toggleItem(a, '2')[0].completed).toBe(true)
    expect(original[0].completed).toBe(false)
  })
  it('deletes and rejects malformed records', () => {
    expect(deleteItem(addItem(original, 'Second', '2'), '2')).toEqual(original)
    expect(parseItems('{bad')).toEqual([])
    expect(parseItems('[{"id":"2","title":"Okay","completed":true},{"id":3}]')).toHaveLength(1)
  })
})
