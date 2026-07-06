export default function HotelCard({ hotel, onSelect }) {
  return (
    <article className="hotel-card" onClick={() => onSelect(hotel)}>
      <div className="hotel-media">
        <img
          src={hotel.thumbnail}
          alt={hotel.name}
          loading="lazy"
          onError={(event) => {
            event.target.src = 'https://via.placeholder.com/640x400?text=Hotel+Image'
          }}
        />
        <div className="hotel-tag">{hotel.location}</div>
      </div>
      <div className="hotel-info">
        <div className="hotel-headline">
          <h3>{hotel.name}</h3>
          <span className="hotel-rating">{Number(hotel.rating).toFixed(1)} ★</span>
        </div>
        <p className="hotel-description">{hotel.description}</p>
        <div className="hotel-footer">
          <span className="hotel-price">₹{Number(hotel.price).toLocaleString()}</span>
          <button type="button" className="view-button">
            View details
          </button>
        </div>
      </div>
    </article>
  )
}
