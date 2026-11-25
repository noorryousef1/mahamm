import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componant/Header'
import Home from './page/Home'
import Events from './page/Events'
import Members from './page/Members'
import Book from './page/Book'
import Dashboard from './page/Dashboard'
import Login from './page/Login'
import RequireAdmin from './componant/RequireAdmin'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/members" element={<Members />} />
        <Route path="/book" element={<Book />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              {(admin) => <Dashboard admin={admin} />}
            </RequireAdmin>
          }
        />
      </Routes>
    </>
  )
}

export default App
