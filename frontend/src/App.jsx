import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DreamListPage from './pages/DreamListPage'
import DreamDetailPage from './pages/DreamDetailPage'
import SearchPage from './pages/SearchPage'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dreams" element={<DreamListPage />} />
          <Route path="/dreams/:id" element={<DreamDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  )
}
