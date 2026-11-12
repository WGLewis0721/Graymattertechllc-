import { useEffect, useState, type FormEvent } from 'react'
import { type StarterItem, STORAGE_KEY, addItem, deleteItem, normalizeTitle, parseItems, renameItem, toggleItem } from './domain/items'

function load(): StarterItem[] {
  try { return parseItems(localStorage.getItem(STORAGE_KEY)) }
  catch { return [] }
}

type Removed = { item: StarterItem; index: number }

export default function App() {
  const [items, setItems] = useState<StarterItem[]>(load)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [removed, setRemoved] = useState<Removed | null>(null)
  const [error, setError] = useState('')
  const [storageError, setStorageError] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }
    catch { setStorageError(true) }
  }, [items])

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setItems(current => addItem(current, draft, crypto.randomUUID()))
      setDraft('')
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to add task.')
    }
  }

  function save(id: string) {
    try {
      const title = normalizeTitle(editDraft)
      setItems(current => renameItem(current, id, title))
      setEditingId(null)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save.')
    }
  }

  function remove(id: string) {
    const index = items.findIndex(item => item.id === id)
    if (index < 0) return
    setRemoved({ item: items[index], index })
    setItems(current => deleteItem(current, id))
  }

  function undoDelete() {
    if (!removed) return
    const { item, index } = removed
    setItems(current => {
      if (current.some(x => x.id === item.id)) return current
      const next = [...current]
      next.splice(Math.min(index, next.length), 0, item)
      return next
    })
    setRemoved(null)
  }

  const complete = items.filter(x => x.completed).length

  return (
    <main className="shell">
      <header className="hero">
        <div className="mark" aria-hidden="true">GM</div>
        <div>
          <p className="eyebrow">GRAY MATTER / APP STARTER</p>
          <h1>Make the work happen.</h1>
          <p className="subtitle">A small complete workflow first. Polish with purpose.</p>
        </div>
      </header>

      <section className="panel" aria-labelledby="task-heading">
        <div className="panel-heading">
          <div><p className="eyebrow">YOUR FIRST VERTICAL SLICE</p><h2 id="task-heading">Today’s tasks</h2></div>
          <span role="status">{complete} / {items.length} complete</span>
        </div>
        <form onSubmit={create} className="entry">
          <label htmlFor="new-task">Add a task</label>
          <div className="entry-row">
            <input id="new-task" value={draft} onChange={e => setDraft(e.target.value)} placeholder="What needs doing?" maxLength={100} />
            <button type="submit" className="primary">Add task</button>
          </div>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
        {storageError && <p className="error" role="status">Storage is unavailable. Changes may not survive reloading.</p>}

        {items.length === 0 ? (
          <div className="empty"><strong>A clean slate.</strong><p>Add a task above. It stays in this browser only.</p></div>
        ) : (
          <ul className="tasks">
            {items.map(item => <li key={item.id}>
              {editingId === item.id ? (
                <form className="task-row" onSubmit={event => { event.preventDefault(); save(item.id) }}>
                  <label className="sr-only" htmlFor={'edit-' + item.id}>Edit task</label>
                  <input id={'edit-' + item.id} autoFocus value={editDraft} onChange={e => setEditDraft(e.target.value)} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setEditingId(null); setError('') }}>Cancel</button>
                </form>
              ) : (
                <div className="task-row">
                  <label className="task-label">
                    <input type="checkbox" checked={item.completed} onChange={() => setItems(current => toggleItem(current, item.id))} />
                    <span className={item.completed ? 'done' : ''}>{item.title}</span>
                  </label>
                  <div className="actions">
                    <button type="button" onClick={() => { setEditingId(item.id); setEditDraft(item.title) }} aria-label={'Edit ' + item.title}>Edit</button>
                    <button type="button" className="destructive" onClick={() => remove(item.id)} aria-label={'Delete ' + item.title}>Delete</button>
                  </div>
                </div>
              )}
            </li>)}
          </ul>
        )}
        {removed && <div className="undo" role="status">Task deleted. <button type="button" onClick={undoDelete}>Undo</button></div>}
      </section>
      <p className="note">Demo only · Browser-local data · No account, sync or payments</p>
    </main>
  )
}
