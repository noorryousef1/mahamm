import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componant/Header'
import Home from './page/Home'
import Events from './page/Events'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </>
  )
}

export default App
