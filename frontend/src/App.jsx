import { useState, useEffect } from 'react'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'completed'

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

  // Stats
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.length - completedCount
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  // Filtered todos
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  return (
    <div className="app">
      {/* Floating Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-icon">✦</div>
          <h1>TodoList</h1>
          <p className="subtitle">Rikkei DevOps Practice</p>
        </header>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Tiến độ</span>
              <span className="progress-count">{progressPercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Add Form */}
        <form className="add-form" onSubmit={addTodo} id="add-todo-form">
          <input
            id="todo-input"
            type="text"
            className="add-input"
            placeholder="✍️  Thêm công việc mới..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="add-btn" id="add-todo-btn">
            ＋ Thêm
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="filter-tabs" id="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            id="filter-all"
          >
            Tất cả <span className="tab-count">{todos.length}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            id="filter-active"
          >
            Đang làm <span className="tab-count">{activeCount}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            id="filter-completed"
          >
            Hoàn thành <span className="tab-count">{completedCount}</span>
          </button>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <div>Đang tải dữ liệu...</div>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              {filter === 'all' ? '📋' : filter === 'active' ? '🎯' : '🎉'}
            </div>
            <div className="empty-text">
              {filter === 'all'
                ? 'Chưa có công việc nào'
                : filter === 'active'
                ? 'Không có công việc đang làm'
                : 'Chưa hoàn thành công việc nào'}
            </div>
            <div className="empty-hint">
              {filter === 'all'
                ? 'Hãy thêm công việc mới để bắt đầu!'
                : filter === 'active'
                ? 'Tuyệt vời! Mọi việc đã hoàn thành 🎉'
                : 'Cố gắng hoàn thành thêm nhé!'}
            </div>
          </div>
        ) : (
          <ul className="todo-list" id="todo-list">
            {filteredTodos.map((todo, index) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="todo-content">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="todo-checkbox"
                    />
                    <span className="checkbox-custom" />
                  </label>
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
                    <span
                      className="todo-title"
                      onDoubleClick={() => startEdit(todo)}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {editId === todo.id ? (
                    <>
                      <button
                        className="btn save-btn"
                        onClick={() => saveEdit(todo)}
                        title="Lưu"
                      >
                        💾
                      </button>
                      <button
                        className="btn cancel-btn"
                        onClick={() => setEditId(null)}
                        title="Hủy"
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn edit-btn"
                        onClick={() => startEdit(todo)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn delete-btn"
                        onClick={() => deleteTodo(todo.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            Made with <span className="footer-heart">❤️</span> for DevOps
            Practice | Rikkei Education
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
