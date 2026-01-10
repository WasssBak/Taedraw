🏆 TAEDRAW – Tournament Draw Generator

TAEDRAW is a modern, responsive web application built with Vite + React that allows users to easily generate, manage, and export tournament brackets.
It supports multiple tournaments, multilingual UI, dark mode, fullscreen mode, and export options (PDF, CSV, XLS).

✨ Features

⚡ Fast & Modern Stack – Built with Vite and React

🏟️ Multiple Tournaments – Create, rename, switch, and delete tournaments

🎲 Random Draw Generator – Automatically generates brackets

📊 Tournament Sizes – Supports 8, 16, 32, 64, and 128 players

🏆 Finalist Seeding – Force two players into opposite sides of the bracket

📂 Import Participants – Import from .txt or .csv files

📤 Export Results

PDF (print-friendly)

CSV

XLS (Excel-compatible)

🌍 Multilingual Support

English 🇺🇸

French 🇫🇷

Spanish 🇪🇸

Arabic 🇸🇦 (RTL supported)

🌙 Dark / Light Mode

🖥️ Fullscreen Mode

💾 Local Storage Persistence

📱 Responsive UI – Works on desktop and mobile

🧩 Tech Stack

Frontend: React

Build Tool: Vite

Styling: Tailwind CSS

Icons: lucide-react

State Management: React Hooks

Persistence: LocalStorage

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/WasssBak/taedraw.git
cd taedraw

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev


The app will be available at:

http://localhost:5173

🏗️ Build for Production
npm run build


Preview the production build locally:

npm run preview

📄 Importing Participants

Supported formats:

.txt

.csv

Rules:

One participant per line

For CSV, only the first column is used

Example:

Player One
Player Two
Player Three

🏆 How Bracket Generation Works

Participants are shuffled randomly

Optional finalists are placed on opposite sides

Empty slots are filled with BYE

Winners advance automatically

Champion is highlighted at the end

📤 Export Options

PDF – Printable bracket view

CSV – Spreadsheet-friendly

XLS – Excel-compatible format

🌍 Language Support

Language can be switched at runtime:

English

French

Spanish

Arabic (RTL layout supported)

📁 Project Structure (Simplified)
src/
 ├─ App.jsx
 ├─ main.jsx
 ├─ index.css
public/
 └─ taedraw_icon.svg

🔒 Data Persistence

All tournaments and brackets are saved automatically in LocalStorage, so data is preserved across page reloads.

👤 Author

Wassim Bakir

🌐 Portfolio: https://wassimbakir.netlify.app/

💼 LinkedIn: https://www.linkedin.com/in/wassim-bakir-617480339/

🐙 GitHub: https://github.com/WasssBak

📜 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.
