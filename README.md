# Taedraw

**Tournament Draw Generator**

A modern, multilingual tournament bracket generator built with React and Vite. Create professional tournament brackets with ease — features include multilingual support (including RTL for Arabic), dark mode, fullscreen, intelligent finalist placement, multi-tournament management, import/export, and smooth bracket progression.

## Highlights
- Manage multiple tournaments (create, switch, rename, delete) — persisted in localStorage
- Participant import from .csv/.txt
- Export bracket/results as PDF, CSV and XLSX
- Finalist placement (force two players to be in opposite halves)
- Interactive bracket: click participant to advance winners
- Sizes available in the UI: 8, 16, 32, 64, 128
- Languages: en, fr, es, ar (RTL support for Arabic)
- Dark mode and fullscreen toggles
- Built with React, Vite, Tailwind CSS and Lucide icons

## Features

### 🌍 Multilingual Support
- French (FR) — Français
- English (EN) — English
- Spanish (ES) — Español
- Arabic (AR) — العربية (with RTL support)

### 🏆 Tournament Management
- Support for tournament sizes: 8, 16, 32, 64, and 128 participants (powers of two)
- Automatic bracket generation with randomized seeding
- Smart BYE handling for incomplete brackets
- Click-to-advance winner selection and real-time progression
- Manage multiple tournaments saved in localStorage (key: `taedraw_data`)

### 🎯 Advanced Features
- Finalist Placement — Pre-define two finalists so they are placed in opposite halves and can only meet in the final
- Import Participants — Import participants from .csv or .txt files (one name per line or comma-separated)
- Export Results — Export bracket/results as PDF (printable), CSV, or XLSX (.xls HTML table)
- Dark Mode — Toggle between light and dark themes
- Fullscreen Mode — Immersive viewing experience
- Input validation and duplicate handling

### 💎 UI / UX
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Color-coded match states (pending, completed, winner)
- Horizontal-scrolling bracket view
- Champion celebration display
- Editable tournament names and accessible controls

## Getting Started

### Prerequisites
- Node.js (v14+ recommended; v16+ preferred)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/WasssBak/Taedraw.git
cd Taedraw
```

2. Install dependencies:
```bash
# npm
npm install

# or yarn
yarn

# or pnpm
pnpm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser:
```
http://localhost:5173
```

### Build for production
```bash
npm run build
```

Preview the production build (if available):
```bash
npm run preview
```

Built files will be in the `dist/` directory.

## Usage

### Creating and Managing Tournaments
1. Use the tournament selector (top-left) to switch between tournaments or create a new one.
2. Rename a tournament using the pencil icon in the tournament menu.
3. Delete a tournament using the X icon (at least one tournament must remain).
4. Tournament data — participants, bracket, finalists — is persisted in localStorage.

### Preparing Participants
- Add participant names in the textarea (one name per line).
- Or import a .csv/.txt file (uses the first column or one name per line).
- Optionally set two finalists (Finalist 1 and Finalist 2) — when both are set they will be placed in opposite halves.

### Generating the Bracket
- Choose a tournament size (8, 16, 32, 64, 128).
- Click "Generate" to build the bracket.
- BYE entries are auto-filled to reach the chosen size.
- Initial BYE matches automatically resolve (the non-BYE player advances).

### Running Matches & Exporting
- Click a participant to mark them as the winner. Winners auto-advance to the next round.
- Export the bracket/results via the Export menu:
  - PDF — opens a printable view (use Print → Save as PDF)
  - CSV — downloads a CSV listing Round, Match, Player 1, Player 2, Winner
  - XLSX — downloads an .xls (HTML table) for spreadsheet programs
- Click the Refresh button to reset the bracket (participants remain).

## Project Structure
```
taedraw/
├── src/
│   ├── App.jsx          # Main application component (UI & logic)
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Project dependencies & scripts
```

## Implementation Notes
- Data persistence key: `taedraw_data` in localStorage.
- Finalist logic: when two finalists are provided they are forced into opposite halves before randomizing the other participants.
- Bracket generation fills missing slots with "BYE". Matches with a BYE automatically advance the other participant.
- Round names are localized; Arabic uses RTL and localized labels.

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing
Contributions are welcome! Please open a Pull Request describing your changes and include relevant tests or screenshots where applicable.

## License
This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments
- Built with React and Vite
- Icons by Lucide React
- Styled with Tailwind CSS

---

Made with ❤️ for tournament organizers everywhere
