import { useState } from "react";
import "./Gallery.css";

function Gallery({ images, onClose }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  return (
    <div className="gallery">
      <button className="gallery-close" onClick={onClose}>×</button>

      <button className="gallery-arrow" onClick={prev}>›</button>
      <img src={images[current]} alt="" />
      <button className="gallery-arrow" onClick={next}>‹</button>

      <p className="gallery-count">{current + 1} / {images.length}</p>
    </div>
  );
}

export default Gallery;
