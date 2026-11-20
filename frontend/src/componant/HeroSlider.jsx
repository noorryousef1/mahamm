import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroSlider.css";

// بيانات السلايدات: صورة + عنوان + نص
const slides = [
  {
    image: "/slides/slide1.jpg",
    title: "فعاليتك. خلّينا نحققها.",
    text: "نظّم مهام فريقك من أول فكرة لآخر يوم بالفعالية.",
  },
  {
    image: "/slides/slide2.jpg",
    title: "كل المهام بمكان واحد",
    text: "وزّع المهام على أعضاء الفريق وتابع شو خلص وشو لسا.",
  },
  {
    image: "/slides/slide3.jpg",
    title: "ولا موعد بيفوتك",
    text: "تاريخ تسليم واضح لكل مهمة، وبتعرف المتأخر من أول نظرة.",
  },
];

function HeroSlider() {
  // رقم السلايد اللي ظاهر هلّق
  const [current, setCurrent] = useState(0);

  // كل 5 ثواني روح عالسلايد اللي بعده
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={index === current ? "slide active" : "slide"}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.text}</p>
            <div className="hero-buttons">
              <Link to="/events" className="btn-primary">استعرض الفعاليات</Link>
              <Link to="/members" className="btn-secondary">تعرّف على الفريق</Link>
            </div>
          </div>
        </div>
      ))}

      {/* الأسهم */}
      <button className="arrow arrow-prev" onClick={prevSlide}>›</button>
      <button className="arrow arrow-next" onClick={nextSlide}>‹</button>

      {/* النقاط تحت */}
      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;