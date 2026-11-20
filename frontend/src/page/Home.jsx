import { useState, useEffect } from 'react'
import HeroSlider from '../componant/HeroSlider'
import Feedback from '../componant/Feedback'
import FeedbackForm from '../componant/FeedbackForm'
import Events from './Events'
import Members from './Members'

const Home = () => {
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => setFeedback(data))
  }, [])

  const addFeedback = (newItem) => {
    setFeedback([...feedback, newItem])
  }

  return (
    <div>
      <HeroSlider />
      <Events />
      <Feedback feedback={feedback} />
      <Members />
      <FeedbackForm onAdd={addFeedback} />
    </div>
  )
}

export default Home
