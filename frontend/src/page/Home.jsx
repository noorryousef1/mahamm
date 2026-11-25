import { useState, useEffect } from 'react'
import HeroSlider from '../componant/HeroSlider'
import Feedback from '../componant/Feedback'
import FeedbackForm from '../componant/FeedbackForm'
import BookCTA from '../componant/BookCTA'
import Events from './Events'
import Members from './Members'
import { getApprovedFeedback } from '../api'

const Home = () => {
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    getApprovedFeedback()
      .then((data) => setFeedback(data))
      .catch(() => setFeedback([]))
  }, [])

  return (
    <div>
      <HeroSlider />
      <Events />
      <BookCTA />
      <Feedback feedback={feedback} />
      <Members />
      <FeedbackForm />
    </div>
  )
}

export default Home
