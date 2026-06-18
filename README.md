# BigQuery Release Notes Dashboard & Share Tool

A responsive, high-performance web application built with **Python Flask** and **Vanilla Web Technologies** (HTML5, JavaScript, CSS3) that retrieves the latest Google Cloud BigQuery release updates, classifies them, and enables instant publishing to X/Twitter.

---

## ✨ Features

- **Real-Time XML Feed Parsing**: Connects directly to Google's official BigQuery release notes RSS feed.
- **Smart Updates Classification**: Tags and colors updates automatically into categorizations like `Feature`, `Deprecated`, `Resolved`, and `Update` based on keywords.
- **Instant Search/Filter**: A debounced frontend search box filters updates by matching titles and descriptions instantly.
- **Tailored Composer & character validator**: Fully featured X/Twitter composer modal that strips HTML tags, formats links, and monitors the standard 280-character limit.
- **Sleek Slate-Dark UI**: Designed with dark theme palettes, clean Outfit typography, card layouts, and responsive transitions.

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask, `feedparser`, `requests`
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (custom variables), Vanilla JavaScript (ES6)
- **Icons**: Font Awesome 6 (integrated via CDN)
- **Fonts**: Google Fonts (Outfit, JetBrains Mono)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Python 3.x and Git installed on your system.

### Installation & Run

1. **Clone the Repository** (or navigate to the workspace directory):
   ```bash
   git clone https://github.com/Sricharan-2502/antigravity-event-talks-app.git
   cd antigravity-event-talks-app
   ```

2. **Install Dependencies**:
   It is recommended to run this inside a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate

   # Install the pinned requirements
   pip install -r requirements.txt
   ```

3. **Start the Flask Server**:
   ```bash
   python app.py
   ```

4. **Access the Dashboard**:
   Open your browser and navigate to:
   👉 **[http://127.0.0.1:5001](http://127.0.0.1:5001)**

---

## 🔌 API Endpoints

- `GET /` — Serves the Single Page Application interface.
- `GET /api/releases` — Downloads, parses, and returns the normalized feed entries in JSON format.

---

## 📂 Project Layout

```
├── app.py                   # Main Flask backend application
├── requirements.txt         # Pinned python libraries list
├── .gitignore               # Ignored version control settings
├── templates/
│   └── index.html           # Main semantic HTML template
└── static/
    ├── css/
    │   └── style.css        # Interactive style rules
    └── js/
        └── main.js          # Core rendering and browser events handler
```
