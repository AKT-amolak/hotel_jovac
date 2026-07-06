import { useEffect, useState } from 'react'

export default function HotelModal({ hotel, onClose }) {
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    setActivePhoto(0)
  }, [hotel])

  if (!hotel) {
    return null
  }

  const photos = hotel.photos || []

  return (
    <div className="modal-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-panel">
        <button className="modal-close" type="button" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">
          <div>
            <span className="modal-badge">{hotel.location}</span>
            <h2>{hotel.name}</h2>
          </div>
          <div className="modal-score">{Number(hotel.rating).toFixed(1)} ★</div>
        </div>
        <div className="modal-grid">
          <div className="modal-image">
            <img
              src={photos[activePhoto] || hotel.thumbnail}
              alt={hotel.name}
              onError={(event) => {
                event.target.src = 'https://via.placeholder.com/720x450?text=Hotel+Image'
              }}
            />
          </div>
          <div className="modal-details">
            <div className="modal-section">
              <h3>Overview</h3>
              <p>{hotel.description}</p>
            </div>
            <div className="modal-specs">
              <div>
                <strong>Price</strong>
                <span>₹{Number(hotel.price).toLocaleString()}</span>
              </div>
              <div>
                <strong>Rating</strong>
                <span>{hotel.rating} / 5.0</span>
              </div>
              <div>
                <strong>Location</strong>
                <span>{hotel.location}</span>
              </div>
            </div>
            <div className="photo-thumbs">
              {photos.slice(0, 5).map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  className={`thumb ${activePhoto === index ? 'active' : ''}`}
                  onClick={() => setActivePhoto(index)}
                >
                  <img src={photo} alt={`Photo ${index + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
