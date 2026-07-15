import { useEffect, useMemo, useState } from 'react'
import HotelCard from './components/HotelCard.jsx'
import HotelModal from './components/HotelModal.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import './App.css'

const API_URL = 'https://demohotelsapi.pythonanywhere.com/hotels/'
const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'rating-asc', label: 'Rating: Low to High' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' }
]
const cityBadges = ['Mumbai', 'Delhi', 'Goa', 'Bengaluru', 'Noida', 'Chennai', 'Pune', 'Hyderabad']

function App() {
  const [hotels, setHotels] = useState([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [sortBy, setSortBy] = useState('recommended')
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Navigation & Authentication states
  const [view, setView] = useState('home') // 'home' | 'login' | 'register'
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse saved user credentials', e)
      }
    }

    setLoading(true)
    setError('')

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to fetch hotels')
        }
        return response.json()
      })
      .then((payload) => {
        setHotels(payload.data || [])
      })
      .catch(() => {
        setError('Unable to load hotels. Please try again later.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleLoginSuccess = (user, rememberMe) => {
    setCurrentUser(user)
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(user))
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    sessionStorage.removeItem('currentUser')
  }

  const maxHotelPrice = useMemo(() => {
    return Math.max(...hotels.map((hotel) => Number(hotel.price) || 0), 5000)
  }, [hotels])

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const term = search.trim().toLowerCase()
        const matchesSearch =
          !term ||
          hotel.name.toLowerCase().includes(term) ||
          hotel.location.toLowerCase().includes(term)
        const matchesLocation = !location || hotel.location === location
        const matchesRating = rating === 0 || Number(hotel.rating) >= rating
        const matchesPrice = Number(hotel.price) <= maxPrice
        return matchesSearch && matchesLocation && matchesRating && matchesPrice
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return Number(a.price) - Number(b.price)
          case 'price-desc':
            return Number(b.price) - Number(a.price)
          case 'rating-desc':
            return Number(b.rating) - Number(a.rating)
          case 'rating-asc':
            return Number(a.rating) - Number(b.rating)
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          default:
            return Number(b.rating) - Number(a.rating)
        }
      })
  }, [hotels, search, location, rating, maxPrice, sortBy])

  return (
    <div className="app-shell">
      {/* App Header / Navigation Bar */}
      <header className="app-header">
        <div className="brand" onClick={() => setView('home')}>
          LuxeStay <span className="brand-dot"></span>
        </div>
        
        <nav className="nav-links">
          <button 
            type="button" 
            className={`nav-item ${view === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>
        </nav>

        <div className="auth-btn-group">
          {currentUser ? (
            <div className="user-display">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <span className="user-name">{currentUser.name}</span>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                type="button" 
                className="header-login-btn" 
                onClick={() => setView('login')}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className="header-register-btn" 
                onClick={() => setView('register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Pages Router View */}
      {view === 'login' && (
        <Login setView={setView} onLoginSuccess={handleLoginSuccess} />
      )}

      {view === 'register' && (
        <Register setView={setView} />
      )}

      {view === 'home' && (
        <>
          <header className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow">LuxeStay React</p>
              <h1>Discover beautiful hotels powered by live API data.</h1>
              <p>
                Browse curated stays, filter by city, price, and rating, then view
                premium details for every hotel.
              </p>
              <div className="hero-actions">
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setShowFilters((value) => !value)}
                >
                  {showFilters ? 'Hide filters' : 'Show filters'}
                </button>
                <a
                  className="secondary-button"
                  href="https://demohotelsapi.pythonanywhere.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  API documentation
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <span className="hero-tag">Live Hotel Search</span>
                <h2>Interactive hotel results with real remote API integration.</h2>
                <p>
                  Search, sort, and explore properties across top Indian destinations
                  with an app designed for responsiveness and usability.
                </p>
              </div>
            </div>
          </header>

          <section className="search-panel">
            <div className="search-grid">
              <label className="search-field">
                <span>Search</span>
                <input
                  type="search"
                  value={search}
                  placeholder="Search by hotel name or city"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <label className="search-field">
                <span>Sort</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  {sortOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="search-field">
                <span>Max price</span>
                <input
                  type="range"
                  min="500"
                  max={Math.max(maxHotelPrice, 5000)}
                  step="100"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                />
                <div className="range-summary">₹{maxPrice.toLocaleString()}</div>
              </label>

              <label className="search-field">
                <span>Minimum rating</span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                />
                <div className="range-summary">{rating === 0 ? 'Any' : `${rating}+`}</div>
              </label>
            </div>

            <div className={`badge-panel ${showFilters ? 'visible' : ''}`}>
              <div className="filter-heading">Quick city filters</div>
              <div className="badges">
                {cityBadges.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`badge ${location === city ? 'active' : ''}`}
                    onClick={() => setLocation(location === city ? '' : city)}
                  >
                    {city}
                  </button>
                ))}
                {location && (
                  <button type="button" className="badge clear" onClick={() => setLocation('')}>
                    Clear city
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="results-section">
            <div className="results-header">
              <div>
                <p className="results-label">Available hotels</p>
                <h2>{filteredHotels.length} stays found</h2>
              </div>
              <div className="results-meta">
                <span>Showing the most relevant hotel cards from the live API.</span>
              </div>
            </div>

            {loading ? (
              <div className="status-message">Loading hotels...</div>
            ) : error ? (
              <div className="status-message error">{error}</div>
            ) : filteredHotels.length === 0 ? (
              <div className="status-message">No hotels match the current filters.</div>
            ) : (
              <div className="hotel-grid">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} onSelect={setSelectedHotel} />
                ))}
              </div>
            )}
          </section>

          <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
        </>
      )}
    </div>
  )
}

export default App
