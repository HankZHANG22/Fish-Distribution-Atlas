# Fish Distribution Atlas

An interactive global map showing fish species distribution with detailed fishing guides.

## Project Structure

```
fish-atlas/
├── index.html              # Main application
├── data/
│   └── fish-data.js        # Fish data (edit to add/modify fish)
├── images/                  # Fish images folder
└── README.md
```

## How to Run

### VS Code + Live Server (Recommended)
1. Install **Live Server** extension
2. Open folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Python HTTP Server
```bash
cd fish-atlas
python -m http.server 8000
# Open http://localhost:8000
```

---

## Adding Images

1. Place images in the `images/` folder
2. Reference them in markdown as: `![Description](images/filename.jpg)`
3. Click any image in the info panel to view fullscreen

**Recommended image sizes:**
- Diagrams: 800-1200px wide
- Maps: 1000-1500px wide
- Format: JPG or PNG

---

## Adding Fish Data

Edit `data/fish-data.js`:

```javascript
{
    id: 1,
    name: "Fish Name",
    latin: "Genus species",
    type: "freshwater",  // or "saltwater"
    countries: ["USA", "Japan", "Australia"],
    markdown: `
## Overview
Description...

## Image Example
![My Image](images/my-image.jpg)

## Table Example
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
    `
}
```

---

## Markdown Features Supported

- **Headers** (## h2, ### h3, etc.)
- **Bold** and *italic* text
- Tables
- Lists (bullet and numbered)
- Blockquotes (> quote)
- Horizontal rules (---)
- Images with click-to-fullscreen
- Code blocks

---

## Country Names

Use common English names:
- "USA", "UK", "Japan", "China", "Germany", etc.

The system automatically converts to ISO codes for map highlighting.

---

## Features

- 🗺️ Interactive Mapbox map with country highlighting
- 🔍 Search and filter fish species
- 🌿 Green = Freshwater / 🌊 Blue = Saltwater
- 📑 Rich Markdown info panels
- 🖼️ Click images to view fullscreen
- 📊 Formatted tables for tackle specs