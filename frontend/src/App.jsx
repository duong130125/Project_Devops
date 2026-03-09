import { useState, useEffect } from 'react'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  // Lấy danh sách todos
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error('Lỗi kết nối server: ', err)
    } finally {
      setLoading(false)
    }
  }

  // Thêm todo mới
  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo.trim(), completed: false }),
      })
      const data = await res.json()
      setTodos([...todos, data])
      setNewTodo('')
    } catch (err) {
      console.error('Lỗi thêm todo:', err)
    }
  }

  // Đánh dấu hoàn thành/chưa hoàn thành
  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      })
      const data = await res.json()
      setTodos(todos.map((t) => (t.id === todo.id ? data : t)))
    } catch (err) {
      console.error('Lỗi cập nhật:', err)
    }
  }

  // Xóa todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos(todos.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Lỗi xóa:', err)
    }
  }

  // Bắt đầu sửa
  const startEdit = (todo) => {
    setEditId(todo.id)
    setEditTitle(todo.title)
  }

  // Lưu sửa
  const saveEdit = async (todo) => {
    if (!editTitle.trim()) return
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, title: editTitle.trim() }),
      })
      const data = await res.json()
      setTodos(todos.map((t) => (t.id === todo.id ? data : t)))
      setEditId(null)
      setEditTitle('')
    } catch (err) {
      console.error('Lỗi sửa:', err)
    }
  }

  const completedCount = todos.filter((t) => t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 TodoList test</h1>

          {/* <p className="subtitle">Rikkei DevOps Practice</p> */}
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <input
            type="text"
            className="add-input"
            placeholder="Thêm công việc mới... ... ..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="add-btn">
            Thêm
          </button>
        </form>

        <div className="stats">
          <span>Tổng: {todos.length}</span>
          <span>Hoàn thành: {completedCount}/{todos.length}</span>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : todos.length === 0 ? (
          <div className="empty">Chưa có công việc nào. Hãy thêm mới!</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="todo-checkbox"
                  />
                  {editId === todo.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo)}
                      autoFocus
                    />
                  ) : (
                    <span className="todo-title" onDoubleClick={() => startEdit(todo)}>
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {editId === todo.id ? (
                    <>
                      <button className="btn save-btn" onClick={() => saveEdit(todo)}>💾</button>
                      <button className="btn cancel-btn" onClick={() => setEditId(null)}>✖</button>
                    </>
                  ) : (
                    <>
                      <button className="btn edit-btn" onClick={() => startEdit(todo)}>✏️</button>
                      <button className="btn delete-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="footer">
          {/* <p>Made with ❤️ for DevOps Practice | Rikkei Education</p> */}
        </footer>
      </div>
    </div>
  )
}

export default App
