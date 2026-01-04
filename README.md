# Taedraw

**Tournament Draw Generator**

A modern, multilingual tournament bracket generator built with React and Vite. Create professional tournament brackets with ease, featuring dark mode, fullscreen support, and intelligent finalist placement.

## Features

### 🌍 Multilingual Support
- **French (FR)** - Français
- **English (EN)** - English
- **Spanish (ES)** - Español
- **Arabic (AR)** - العربية (with RTL support)

### 🏆 Tournament Management
- Support for tournament sizes: 4, 8, 16, 32, 64, and 128 participants
- Automatic bracket generation with randomized seeding
- Smart BYE handling for incomplete brackets
- Click-to-advance winner selection
- Real-time bracket progression

### 🎯 Advanced Features
- **Finalist Placement**: Pre-define two finalists who will be placed in opposite halves of the bracket
- **Dark Mode**: Toggle between light and dark themes
- **Fullscreen Mode**: Immersive tournament viewing experience
- **Duplicate Detection**: Prevents duplicate participant names
- **Input Validation**: Ensures proper tournament setup

### 💎 Modern UI/UX
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Color-coded match states (pending, completed, winner)
- Horizontal scrolling bracket view
- Champion celebration display

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taedraw.git
cd taedraw
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Tournament

1. **Select Tournament Size**: Choose from 4 to 128 participants (power of 2)
2. **Add Participants**: Enter participant names, one per line
3. **Optional - Set Finalists**: Specify two players who should only meet in the final
4. **Generate**: Click "Generate tournament" to create the bracket

### Managing Matches

- Click on a participant's name to declare them the winner
- The bracket automatically advances winners to the next round
- BYE matches are automatically resolved
- Track progress through all rounds until a champion is crowned

### Customization

- **Language**: Select from the language dropdown (🇫🇷 🇬🇧 🇪🇸 🇸🇦)
- **Theme**: Toggle between light and dark mode with the sun/moon icon
- **Fullscreen**: Click the maximize icon for fullscreen viewing

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
taedraw/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Project dependencies
```

## Features in Detail

### Finalist Logic
When two finalists are specified:
- They are automatically placed in opposite halves of the bracket
- This ensures they can only meet in the final match
- Other participants are randomly distributed around them

### Bracket Generation
- Uses Fisher-Yates shuffle algorithm for fair randomization
- Automatically adds BYE entries for incomplete brackets
- Maintains bracket structure with proper power-of-2 sizing

### Round Naming
Rounds are automatically named based on tournament stage:
- Final
- Semi-finals
- Quarter-finals
- Round of 16 (Eighths)
- Round of 32 (Sixteenths)
- Round of 64 (Thirty-seconds)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with React and Vite
- Icons by Lucide React
- Styled with Tailwind CSS

---

**Made with ❤️ for tournament organizers everywhere**