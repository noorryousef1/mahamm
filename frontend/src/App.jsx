import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componant/Header'
import Home from './page/Home'
import Events from './page/Events'
import Members from './page/Members'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </>
  )
}

export default App
