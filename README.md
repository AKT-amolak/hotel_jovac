# LuxeStay React

A modern React hotel search application built with Vite and integrated with the Demo Hotels API.

## Project Overview

- **React + Vite** frontend
- **Live API integration** with `https://demohotelsapi.pythonanywhere.com/hotels/`
- Interactive filtering, sorting, and hotel details modal
- Responsive, clean UI built for desktop and mobile

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the local URL shown in the terminal and explore the hotel search interface.

## Project Structure

```
/d/new/
  ├── package.json
  ├── vite.config.js
  ├── public/
  │   └── index.html
  ├── src/
  │   ├── App.jsx
  │   ├── App.css
  │   ├── index.css
  │   ├── main.jsx
  │   └── components/
  │       ├── HotelCard.jsx
  │       └── HotelModal.jsx
  ├── .gitignore
  └── README.md
```

## API Integration

- The app fetches hotel listings from `https://demohotelsapi.pythonanywhere.com/hotels/`
- Results are displayed live and can be filtered by search, location, rating, and price
- Clicking a hotel opens a detail modal with gallery preview and property information

## Notes

- The design is responsive and mobile-friendly
- The app uses real hotel data from the provided demo API
