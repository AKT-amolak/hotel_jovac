# LuxeStay - Premium Hotel Search & CRUD Web Application

LuxeStay is a visually stunning, premium, and fully responsive Single-Page Application (SPA) designed to browse, filter, search, and manage luxury hotel properties. Built using pure **Vanilla HTML5, Vanilla CSS3 (with custom design system variables), and Modern Modular JavaScript (ES6)**, it integrates directly with the **Demo Hotels API**.

🔗 **API Root URL**: `https://demohotelsapi.pythonanywhere.com/hotels/`

---

## ✨ Key Features

1. **Stunning Responsive UI/UX**:
   - Clean, modern layout using HSL custom color tokens.
   - Elegant dark/light mode toggle with state persisted in browser `localStorage`.
   - Rich hover transitions, micro-animations, and sliding toast notifications.
   - Graceful image load error fallbacks.

2. **Advanced Interactive Search & Filters**:
   - Live debounce search by hotel name or location.
   - Popular city quick-filter badges (Noida, Delhi, Mumbai, Bengaluru, Goa, Chennai, etc.).
   - Interactive price range slider.
   - Minimum rating filter slider.
   - Sorting options (Top Rated, Lowest Rated, Price: High to Low, Price: Low to High, Alphabetical).

3. **Full CRUD Operations (Persistent on Remote API)**:
   - **Create**: Add a new hotel with fields for name, price, rating, city location, main thumbnail URL, additional gallery photos, and full description.
   - **Read**: View details of any hotel in an elegant, large modal containing an active multi-image slideshow, specifications sheet, and booking button.
   - **Update**: Edit fields of existing hotel listings in-place, updating remote data via `PUT` request.
   - **Delete**: Remove a property permanently from the directory, validated via custom validation confirmations.

4. **Realistic Stay Reservation Calculator**:
   - Interactive booking modal with name and email validation.
   - Future date constraints (Check-out must be after check-in).
   - Real-time stay cost calculation based on check-in/out duration, selected room luxury multiplier (Standard, Deluxe, Signature Villa), and guest counts.
   - Digital receipt layout on success with receipt layout summary and custom booking confirmation IDs.

---

## 📂 Folder Structure

```
d:/new/
  ├── index.html            # Main entry point (SPA structural shell)
  ├── .gitignore            # Git ignore configurations
  ├── README.md             # Documentation & Setup Guide
  ├── css/
  │   ├── styles.css        # Main layout, typography, CSS tokens, and theme settings
  │   ├── components.css    # Card elements, input elements, buttons, modals, and list grids
  │   └── animations.css    # Skeletons, fades, slides, shakes, and spinners
  └── js/
      ├── app.js            # Bootstrapper, view coordinator, and DOM event bindings
      ├── api.js            # HotelAPI client class wrapping native fetch (GET, POST, PUT, DELETE)
      ├── state.js          # App state manager containing filters and reactive updates
      ├── utils.js          # Debouncers, formatters, and HTML generator helpers
      └── components/
          ├── Toast.js       # Auto-dismiss notifications (Success, Error, Info)
          ├── HotelCard.js   # Individual grid listings with overlay triggers
          ├── HotelDetail.js # Large specifications display and photo slide carousel
          ├── HotelForm.js   # Dynamic modal form handling create/edit actions
          └── BookingModal.js# Mock stay booking forms and dynamic calculators
```

---

## 🚀 How to Run Locally

Since the project uses vanilla web technologies and native ES6 JavaScript modules, it can be run directly using any static local server without any build tools.

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in VS Code.
2. Click **Go Live** on the bottom status bar (requires the "Live Server" extension).
3. The project will open automatically at `http://127.0.0.1:5500/`.

### Option 2: Python HTTP Server
If you have Python installed, run this command in your project directory:
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000/`.

### Option 3: Node.js (serve)
If you have Node.js installed, run:
```bash
npx serve
```
Then navigate to the URL printed in the terminal (usually `http://localhost:3000/`).

---

## 🛠️ API Integration Details

All endpoints follow Django REST Framework syntax:
- **Fetch Listings**: `GET /hotels/?location={city}&price={exact_price}&min_price={min}&max_price={max}&min_rating={min}&max_rating={max}&search={term}&order_by={sorting}`
- **Fetch by ID**: `GET /hotels/{id}/`
- **Create**: `POST /hotels/`
- **Update**: `PUT /hotels/{id}/`
- **Delete**: `DELETE /hotels/{id}/`
