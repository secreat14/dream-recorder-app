import { useState } from 'react'

export default function SearchBar({ onSearch, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="搜索梦境关键词..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit" className="search-btn">搜索</button>
    </form>
  )
}
